import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import profilelogo from "../assets/images/profilelogo.jpg";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState(localStorage.getItem("Username"));
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // disable back button

  useEffect(() => {
    // Disable browser back button
    const disableBackButton = () => {
      window.history.pushState(null, null, window.location.href);
    };
    window.addEventListener("popstate", disableBackButton);

    // Set initial state
    window.history.pushState(null, null, window.location.href);

    return () => {
      window.removeEventListener("popstate", disableBackButton);
    };
  }, []);

  const postData = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("All Fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:2000/api/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      localStorage.setItem("token", resData.token);
      console.log(resData);
      if (resData.message === "you have logged in") {
        toast.success("you have logged in");
        setTimeout(() => {
          toast.dismiss();
          setTimeout(() => {
            navigate("/profile");
          }, 500);
        }, 3000);
        return;
      }

      if (resData.message === "username or password is not valid") {
        toast.error("username or password is not valid");
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="login">
        <h1>Hello Again!</h1>
        <h3>Explore more by connnecting with us</h3>
        <img src={profilelogo} alt="" />
        <form onSubmit={postData} method="post">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
          />
          <br />
          <input
            type="text"
            name="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
          <br />
          <button>Let's Go</button>
        </form>
        <div className="miniForm">
          <div>
            <p>Not a member?</p>
            <Link to="/register">Register Now</Link>
          </div>
          <div>
            <p>Forget Password</p>
            <Link to="/email">Recover Now</Link>
          </div>
        </div>
      </div>
    </>
  );
}
