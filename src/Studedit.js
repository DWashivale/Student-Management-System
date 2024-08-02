import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Studedit = () => {
  const { studid } = useParams();
  const [studdata, studdatachange] = useState({});
  useEffect(() => {
    fetch("http://localhost:8000/students/" + studid)
      .then((res) => res.json())
      .then((resp) => {
        idchange(resp.id);
        namechange(resp.name);
        educationchange(resp.education);
        agechange(resp.age);
        emailidchange(resp.email);
        phonechange(resp.phone);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const [id, idchange] = useState("");
  const [name, namechange] = useState("");
  const [education, educationchange] = useState("");
  const [age, agechange] = useState("");
  const [email, emailidchange] = useState("");
  const [phone, phonechange] = useState("");
  const navigate = useNavigate();
  const [validation, valchange] = useState(false);

  const handlesubmit = (e) => {
    e.preventDefault();
    const empdata = { id, name, education, age, email, phone };

    fetch("http://localhost:8000/students/" + studid, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empdata),
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire({
          title: "Edited Successfully!",
          text: "Your changes have been edited successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => navigate("/"));
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
                <h2>Edit Student</h2>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>ID:</label>
                      <input
                        value={id}
                        disabled="disabled"
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        value={name}
                        onMouseDown={(e) => valchange(true)}
                        onChange={(e) => namechange(e.target.value)}
                        className="form-control"
                        required
                      ></input>
                      {name?.length === 0 && validation && (
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
                        required
                      ></input>
                      {education?.length === 0 && validation && (
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
                      {age?.length === 0 && validation && (
                        <span className="text-danger">Enter the age</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Email Id::</label>
                      <input
                        value={email}
                        onMouseDown={(e) => valchange(true)}
                        onChange={(e) => emailidchange(e.target.value)}
                        className="form-control"
                        required
                      ></input>
                      {email?.length === 0 && validation && (
                        <span className="text-danger">Enter the email</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Phone:</label>
                      <input
                        value={phone}
                        onMouseDown={(e) => valchange(true)}
                        onChange={(e) => phonechange(e.target.value)}
                        className="form-control"
                        required
                      ></input>
                      {phone?.length === 0 && validation && (
                        <span className="text-danger">
                          Enter the phone number
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="col-lg-12">
                      <div className="form-group ">
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

export default Studedit;
