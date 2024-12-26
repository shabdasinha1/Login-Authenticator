import { useState } from "react";
import "./Reset.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Reset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("All field are required");
    }

    try {
      const res = await fetch("http://localhost:2000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      if (res.ok) {
        toast.success("Password Changed successfully");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          toast.dismiss();
          setTimeout(() => {
            navigate("/");
          }, 700);
        }, 2500);
      } else {
        const { message } = await res.json();
        toast.error(message || "Failed to reset password. Try again!");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <div className="reset">
        <h1>Reset</h1>
        <p>Enter new password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="New Password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <br />
          <input
            type="text"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <br />
          <button>Reset</button>
        </form>
      </div>
    </>
  );
}
