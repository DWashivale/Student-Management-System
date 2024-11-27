import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setusers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchusers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users");
        setusers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchusers();
  }, []);

  const handleSave = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Please enter  email and password.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/users");
      const updatedusers = response.data;
      setusers(updatedusers);

      const foundStudent = updatedusers.find(
        (student) => student.email === email
      );
      if (foundStudent) {
        const isCorrectPass = foundStudent.password === password;
        if (isCorrectPass) {
          setUser(foundStudent);
          navigate("/");
          localStorage.setItem("user", foundStudent);
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
    <div>
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
              <div className="card-body p-4 p-sm-5">
                <h5 className="card-title text-center mb-5 fw-light fs-5">
                  Sign In
                </h5>
                <form>
                  <div className="form-floating mb-3">
                    <input
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                      type="email"
                      className="form-control"
                      id="floatingemail"
                      placeholder="name@example.com"
                    />
                    <label htmlFor="floatingemail">Email address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
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
                      className="btn btn-primary btn-login text-uppercase fw-bold"
                      type="button"
                    >
                      Sign In
                    </button>
                  </div>
                  <div className="text-danger">{error}</div>
                  <hr className="my-4"></hr>

                  <div className="d-grid">
                    <Link
                      className="btn btn-outline-primary btn-login text-uppercase fw-bold"
                      to="/signup"
                    >
                      Sign Up
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

