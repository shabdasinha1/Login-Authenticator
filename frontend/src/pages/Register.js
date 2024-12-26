import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import profilelogo from "../assets/images/profilelogo.jpg";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const file = useRef();
  const navigate = useNavigate(); 

  const postData = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("All field are required");
      return;
    }
    
    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("password", password);
    localStorage.setItem("Username",username);

    if (image) {
      data.append("image", image);
    }
    try {
      const res = await fetch("http://localhost:2000/api/register", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      console.log(resData);
      if (resData.message === "username or email already exists") {
        toast.error("username or email already exist");
        return;
      }
      if (resData) {
        // localStorage.setItem("userEmail", email);
        toast.success("Registration successful");
        setUsername("");
        setEmail("");
        setPassword("");
        setImage(null);

        setTimeout(() => {
          toast.dismiss();
          setTimeout(() => {
            navigate("/");
          }, 500);
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageClick = () => {
    file.current.click();
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setImage(selectedFile);
    }
  };
  

  return (
    <>
      <div className="register">
        <h1>Register</h1>
        <h3>Happy to join you!</h3>
        <form onSubmit={postData}>
          <img
            src={image ? URL.createObjectURL(image) : profilelogo}
            alt="user"
            onClick={handleImageClick}
          />
          <input
            type="file"
            id="image-upload"
            ref={file}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username*"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <br />
          <input
            type="text"
            name="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password*"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <br />
          <button>Register</button>
        </form>
        <p>Already Register?</p>
        <Link to="/">Login Now</Link>
      </div>
    </>
  );
}
