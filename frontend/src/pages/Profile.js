import "./Profile.css";
import { Link } from "react-router-dom";
import profilelogo from "../assets/images/profilelogo.jpg";
import { useEffect, useState } from "react";

export default function Profile() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    address: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(profilelogo);

  const token = localStorage.getItem("token");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleFileChage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setData({
        ...data,
        image: file, // Update the image in the data state
      });
    } else {
      setImagePreview(profilelogo);
      setData({
        ...data,
        image: null, // Reset the image in the data state
      });
    }
  };

  const getData = async () => {
    const res = await fetch("http://localhost:2000/api/get-user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const resData = await res.json();
    console.log(resData);
    setData(resData.userData);
    if (resData.userData.image) {
      const baseURL = "http://localhost:2000";
      setImagePreview(`${baseURL}/${resData.userData.image}`);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append("firstName", data.firstName);
    updatedData.append("lastName", data.lastName);
    updatedData.append("contact", data.contact);
    updatedData.append("address", data.address);
    if (data.image !== profilelogo) {
      updatedData.append("image", data.image);
    }

    try {
      const res = await fetch("http://localhost:2000/api/update", {
        method: "PUT",
        body: updatedData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.json();
      console.log(resData);
      if (resData.msg === "Data updated") {
        alert("Profile updated");
      } else {
        alert("unable to update");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <>
      <div className="main">
        <h2>Profile</h2>
        <p>You can update the details</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="image">
            <img
              src={imagePreview}
              alt=""
              onError={() => setImagePreview(profilelogo)}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                marginTop: "10px",
              }}
            />
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChage}
            hidden
          />
          <div className="first">
            <input
              type="text"
              placeholder="FirstName"
              value={data.firstName}
              name="firstName"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="LastName"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="first">
            <input
              type="text"
              placeholder="Contact"
              name="contact"
              value={data.contact}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={data.email}
              onChange={handleChange}
              disabled
            />
          </div>
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={data.address}
            onChange={handleChange}
          />
          <br />
          <button>Update</button>
          <p>
            Come back later?{" "}
            <Link to={"/"} onClick={handleLogout}>
              logout
            </Link>{" "}
          </p>
        </form>
      </div>
    </>
  );
}
