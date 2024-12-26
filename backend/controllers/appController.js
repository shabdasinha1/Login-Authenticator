const userSchema = require("./../models/userModel");
const bcrypt = require("bcrypt");
const path = require("path");
const filePath = path.join(__dirname, "..", "assets");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const image = req.files && req.files.image ? req.files.image : null;

  if (!username || !email || !password) {
    res.status(400).json({
      message: "All fields are required",
    });
  } else {
    const userExist = await userSchema.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (userExist) {
      res.status(400).json({
        message: "username or email already exists",
      });
    } else {
      try {
        const hashedPass = await bcrypt.hash(password, 10);
        if (image) {
          await image.mv(path.join(filePath, image.name));
        }
        const data = new userSchema({
          username,
          email,
          password: hashedPass,
          image: image ? image.name : "",
        });

        const dataCreated = await data.save();
        res.status(201).json({
          message: dataCreated,
        });
      } catch (err) {
        res.status(400).json({
          message: "Unable to register",
        });
      }
    }
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const userExist = await userSchema.findOne({ username: username });
      if (userExist) {
        const isMatched = await bcrypt.compare(password, userExist.password);
        if (userExist.username === username && isMatched) {
          const token = jwt.sign(
            { id: userExist._id, username: userExist.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }
          );
          res.status(200).json({
            message: "you have logged in",
            username: userExist.username,
            token,
          });
        } else {
          res.status(400).json({
            message: "username or password is not valid",
          });
        }
      } else {
        res.status(400).json({
          message: "you are not a registered user",
        });
      }
    } else {
      res.status(400).json({
        message: "all fields are required",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "unable to login",
    });
  }
};

// const update = async (req, res) => {
// try {
//   const { id } = req.params;
//   const { firstName, lastName, contact, address } = req.body;

//   const userExist = await userSchema.findOne({ _id: id });
//   if (!userExist) {
//     res.status(400).json({
//       message: "user not found",
//     });
//   }

//   const updatedUser = await userSchema.updateOne(
//     { _id: id },
//     { $set: { firstName, lastName, contact, address } }
//   );
//   res.status(200).json({
//     message: "data update successfully",
//     updatedUser
//   });
// } catch (err) {
//   console.log(err);
//   res.status(400).json({
//     message: "unable to update data",
//   });
// }
// };

const updateProfile = async (req, res) => {
  const { id } = req.user;

  const { firstName, lastName, contact, email, address } = req.body;
  const image = req.files && req.files.image ? req.files.image : null;

  try {
    if (image) {
      await image.mv(path.join(filePath, image.name));
    }
      await userSchema.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            firstName,
            lastName,
            contact,
            address,
            image: image ? image.name : undefined,
          },
        }
      );
    
    res.status(200).json({msg: "Data updated"});
  } catch (err) {
    res.status(400).json({
      message: "unable to update",
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.user;
  try {
    const userData = await userSchema.findOne({ _id: id }).select("-password");
    res.status(200).json({
      message: "user found",
      userData,
    });
  } catch (err) {
    res.status(400).json({
      message: "error encountered",
      err,
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "shabdasinha1@gmail.com",
    pass: "glra xnhv yayr bown",
  },
});

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const userExist = await userSchema.findOne({ email });

  if (!userExist) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const otp = generateOtp();
  userExist.otp = otp;
  userExist.otpExpiry = Date.now() + 15 * 60 * 1000; // 15min in milisec
  await userExist.save();

  const mailOptions = {
    from: "shabdasinha1@gmail.com",
    to: userExist.email,
    subject: "Password recovery OTP",
    text: `Your OTP for password recovery is ${otp}. It is valid for 15 min only.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(400).json({
        message: "Error in sending OTP",
        error,
      });
    }
    res.status(200).json({
      message: "OTP sent to email",
    });
  });
};

// const verifyOtp = async (req, res) => {
//   const { otp, email } = req.body;
//   const userExist = await userSchema.findOne({ email });

//   if (!userExist) {
//     res.status(400).json({
//       message: "user not found",
//     });
//   }
//   const currentTime = Date.now();
//   if(currentTime>userExist.otpExpiry){
//     return res.status(400).json({
//       message:"OTP has expired"
//     })
//   }

//   if (otp === userExist.otp) {
//     res.status(200).json({
//       message: "OTP verified successfully",
//     });
//     await userSchema.updateOne({ email }, { $set: { otp: "", otpExpiry: "" } });
//   } else {
//     res.status(400).json({
//       message: "incorrect otp",
//     });
//   }

// };

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const userExist = await userSchema.findOne({ email });

    if (!userExist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const currentTime = Date.now();

    // Check if OTP has expired
    if (currentTime > userExist.otpExpiry) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Verify the OTP
    if (otp === userExist.otp) {
      // Clear the OTP and its expiry from the database
      await userSchema.updateOne(
        { email },
        { $set: { otp: null, otpExpiry: null } }
      );

      return res.status(200).json({
        message: "OTP verified successfully",
      });
    } else {
      return res.status(400).json({
        message: "Incorrect OTP",
      });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// const reset = async (req, res) => {
//   try {
//     const { email, password, confirmPassword } = req.body;

//     const userExist = await userSchema.findOne({ email });

//     if (!userExist) {
//       res.status(400).json({
//         message: "user not found",
//       });
//     }
//     const isMatch = await bcrypt.compare(userExist.password, password);
//     if (!isMatch) {
//       if (password === confirmPassword) {
//         const hashedPass = await bcrypt.hash(password, 10);
//         await userSchema.updateOne(
//           { email },
//           { $set: { password: hashedPass } }
//         );
//         res.status(200).json({
//           message: "password changed",
//         });
//       }
//      else {
//       res.status(400).json({
//         message: "Enter same password in both fields",
//       });
//     }}else{
//       res.status(400).json({
//         message:"Password already exists"
//       })
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       message: "unable to reset password",
//     });
//   }
// };

const reset = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Check if the user exists
    const userExist = await userSchema.findOne({ email });
    if (!userExist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if the new password matches the current password
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (isMatch) {
      return res.status(400).json({
        message: "New password cannot be the same as the current password",
      });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // Hash the new password and update it in the database
    const hashedPass = await bcrypt.hash(password, 10);
    await userSchema.updateOne({ email }, { $set: { password: hashedPass } });

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (err) {
    // console.error("Error resetting password:", err);
    return res.status(500).json({
      message: "Unable to reset password",
    });
  }
};

module.exports = { register, login, updateProfile, getUser, sendOtp, verifyOtp, reset };
