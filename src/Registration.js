import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function Registration({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (password !== passwordConfirmation) {
      errors.passwordConfirmation = "Passwords do not match";
    }

    return errors;
  };

  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setIsSaving(true);

      // Check if email already exists in the `user` collection
      axios
        .get(`http://localhost:8000/user?email=${email}`)
        .then((response) => {
          if (response.data.length > 0) {
            setIsSaving(false);
            setErrors({ email: "Email already exists" });
          } else {
            // Proceed with user creation
            axios
              .post("http://localhost:8000/user", {
                name: name,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
              })
              .then((response) => {
                localStorage.setItem("user", JSON.stringify(response.data));
                setUser(response.data);
                Swal.fire({
                  icon: "success",
                  title: "Sign Up successful!",
                  showConfirmButton: false,
                  timer: 1500,
                });
                setIsSaving(false);
                setName("");
                setEmail("");
                setPassword("");
                setPasswordConfirmation("");
                setErrors({});
                navigate("/");
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  title: "An Error Occurred!",
                  text: error.response.data.message || "Something went wrong!",
                  showConfirmButton: false,
                  timer: 1500,
                });
                setIsSaving(false);
              });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "An Error Occurred!",
            text: error.response.data.message || "Something went wrong!",
            showConfirmButton: false,
            timer: 1500,
          });
          setIsSaving(false);
        });
    } else {
      setErrors(errors);
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
                  Create new account
                </h5>
                <form>
                  <div className="form-floating mb-3">
                    <input
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      id="floatingInput"
                      placeholder="Jhon Joe"
                    />
                    <label htmlFor="floatingInput">Name</label>
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      id="floatingemail"
                      placeholder="name@example.com"
                    />
                    <label htmlFor="floatingemail">Email address</label>
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                      type="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      id="floatingPassword"
                      placeholder="Password"
                    />
                    <label htmlFor="floatingPassword">Password</label>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      value={passwordConfirmation}
                      onChange={(event) => {
                        setPasswordConfirmation(event.target.value);
                      }}
                      type="password"
                      className={`form-control ${
                        errors.passwordConfirmation ? "is-invalid" : ""
                      }`}
                      id="password_confirmation"
                      name="password_confirmation"
                      placeholder="Password Confirmation"
                    />
                    <label htmlFor="password_confirmation">
                      Password Confirmation
                    </label>
                    {errors.passwordConfirmation && (
                      <div className="invalid-feedback">
                        {errors.passwordConfirmation}
                      </div>
                    )}
                  </div>

                  <div className="d-grid">
                    <button
                      disabled={isSaving}
                      onClick={handleSave}
                      className="btn btn-primary btn-login text-uppercase fw-bold"
                      type="button"
                    >
                      Sign Up
                    </button>
                  </div>
                  <hr className="my-4"></hr>

                  <div className="d-grid">
                    <Link
                      className="btn btn-outline-primary btn-login text-uppercase fw-bold"
                      to="/login"
                    >
                      Log in
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

export default Registration;
