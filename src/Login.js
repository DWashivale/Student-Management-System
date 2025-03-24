import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Please enter an email and password.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/users");
      const updatedUsers = response.data;

      const foundStudent = updatedUsers.find(
        (student) => student.email === email
      );
      if (foundStudent) {
        if (foundStudent.password === password) {
          setUser(foundStudent);
          navigate("/");
          localStorage.setItem("user", JSON.stringify(foundStudent));
          setError("");
        } else {
          setError("Incorrect Password!");
        }
      } else {
        setError("User Not Found!");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div
  className="d-flex justify-content-center align-items-center vh-100"
  style={{
    backgroundImage: "url('/images/Background.png')", // ✅ Corrected
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    
  }}
>

      {/* Main Card Container */}
      <div
        className="shadow-lg rounded-3 d-flex bg-white"
        style={{ width: "850px", height: "450px" }}
      >
        {/* Left Side - Image */}
        <div className="col-md-6 d-none d-md-block">
          <img
            src="/images/login-bg.png"
            alt="Login Illustration"
            className="img-fluid h-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
          <div className="text-center mb-3">
      
            <h4 className="fw-bold">Login Here</h4>
            <p className="text-muted">Welcome Back!</p>
          </div>

          <form>
            <div className="form-floating mb-3">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="Employee ID"
              />
              <label htmlFor="floatingEmail">Username</label>
            </div>
            <div className="form-floating mb-3">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="d-grid">
              <button
                onClick={handleSave}
                className="btn btn-primary text-uppercase fw-bold"
                type="button"
              >
                Sign In
              </button>
            </div>
            <hr className="my-4"></hr>
            <div className="d-grid">
              <Link
                className="btn btn-outline-primary btn-login text-uppercase fw-bold"
                to="/signup"
              >
                Sign Up
              </Link>
            </div>
            <div className="text-danger mt-3">{error}</div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
