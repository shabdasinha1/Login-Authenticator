import "./Recovery.css";
import { useState } from "react";
import { toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

export default function Email() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => { 
    e.preventDefault();

    // Basic email validation
    if (!email) {
      toast.error("Email is required!"); // Error toast
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email!"); // Error toast for invalid email
      return;
    }

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
        localStorage.setItem("email",email);
        toast.success("OTP sent to your email!"); // Success message from API
        setEmail("");
        setTimeout(() => {
          toast.dismiss();
          setTimeout(() => {  
            navigate("/recovery");
          }, 700);
        }, 2500);
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
    <>
      <div className="recovery">
        <h1>Recovery</h1>
        <form onSubmit={handleSubmit}>
          <label>Enter your email for OTP</label>
          <br />
          <input
            type="text"
            placeholder="Enter your email for OTP"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <button type="submit">Continue</button>
        </form>
      </div>
    </>
  );
}
