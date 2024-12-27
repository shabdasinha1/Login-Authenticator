import { Link, useNavigate } from "react-router-dom";
import "./Recovery.css";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Recovery() {
  const [otp, setOtp] = useState("");
  const [email,setEmail]= useState(localStorage.getItem("email"));
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("OTP is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:2000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email,otp }),
      });

      if (res.ok) {
        toast.success("OTP verified successfully");
        setOtp("");
        setTimeout(() => {
            toast.dismiss();
            setTimeout(() => {
              navigate("/reset");
            }, 700);
          }, 2500);
      } else {
        const { message } = await res.json();
        toast.error(message || "Failed to verify OTP. Try again!");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const resendOtp = async (e) => { 
    
    // API call to send OTP
    try {
      const res = await fetch("http://localhost:2000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Handle API response
      if (res.ok) {
        toast.success("OTP sent to your email!"); // Success message from API
      } else {
        toast.error("Failed to send OTP. Try again!"); // Error from API
      }
    } catch (err) {
      // Handle network errors
      console.error("Error sending OTP:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="recovery">
      <h1>Password Recovery</h1>
      <p>Enter the OTP sent to your registered email address</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="otp">Enter 6-digit OTP:</label>
        <br />
        <input
          type="text"
          id="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <br />
        <button type="submit">Recover</button>
      </form>
      <p>
        Didn't receive the OTP?&nbsp;
        <Link to="/recovery" onClick={() => resendOtp()}>Resend</Link>
      </p>
    </div>
  );
}