import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Studcreate = () => {
  const [name, namechange] = useState("");
  const [education, educationchange] = useState("");
  const [age, agechange] = useState("");
  const [email, emailidchange] = useState("");
  const [phone, phonechange] = useState("");
  const [active, activechange] = useState(true);
  const navigate = useNavigate();
  const [validation, valchange] = useState(false);

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (val === "" || Number.isInteger(parseInt(val))) {
      phonechange(val);
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const empdata = { name, education, age, email, phone, active };

    fetch("http://localhost:8000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empdata),
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire({
          title: "Added Successfully!",
          text: "Your data has been added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => navigate("/Course"));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      <div className="row">
        <div className="offset-lg-3 col-lg-6">
          <form className="container" onSubmit={handlesubmit}>
            <div className="card" style={{ textAlign: "left" }}>
              <div className="card-title">
                <h2>Add Student</h2>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        value={name}
                        onMouseDown={(e) => valchange(true)}
                        onChange={(e) => namechange(e.target.value)}
                        className="form-control"
                      ></input>
                      {name.length === 0 && validation && (
                        <span className="text-danger">Enter the name</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Education:</label>
                      <input
                        value={education}
                        onMouseDown={(e) => valchange(true)}
                        onChange={(e) => educationchange(e.target.value)}
                        className="form-control"
                      ></input>
                      {education.length === 0 && validation && (
                        <span className="text-danger">Enter the education</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Age:</label>
                      <input
                        value={age}
                        onMouseDown={(e) => valchange(true)}
                        onChange={(e) => agechange(e.target.value)}
                        className="form-control"
                        required
                      ></input>
                      {age.length === 0 && validation && (
                        <span className="text-danger">Enter the age</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Email Id:</label>
                      <input
                        value={email}
                        onMouseDown={(e) => valchange(true)}
                        onChange={(e) => emailidchange(e.target.value)}
                        className="form-control"
                        required
                      ></input>
                      {email.length === 0 && validation && (
                        <span className="text-danger">Enter the email</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Phone:</label>
                      <input
                        className="form-control"
                        type="tel"
                        value={phone}
                        required
                        maxLength={10}
                        onChange={(e) => {
                          handlePhoneChange(e);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <button className="btn btn-success mt-2" type="submit">
                          Save
                        </button>
                        <Link
                          to="/"
                          className="btn btn-danger mt-2"
                          style={{ marginLeft: "4px" }}
                        >
                          Back
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Studcreate;
