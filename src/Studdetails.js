import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Studdetails = () => {
  const { studid } = useParams();
  const [studdata, studdatachange] = useState({});
  useEffect(() => {
    fetch("http://localhost:8000/students/" + studid)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        studdatachange(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  return (
    <div>
      <div className="card details-container" style={{ textAlign: "left" }}>
        <div className="card-title">
          <h2>Student Details</h2>
        </div>
        <div className="card-body"></div>
        {studdata && (
          <div>
            <h4>
              The Student name is:{studdata.name} ({studdata.id}){" "}
            </h4>
            <h4>The Education is: {studdata.education}</h4>
            <h4>The age is the: {studdata.age}</h4>
            <h3>Contact Details:</h3>
            <h4>Email is:{studdata.email}</h4>
            <h4>Phone is:{studdata.phone}</h4>
            <Link className="btn btn-danger mb-2" to="/">
              Back to list
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Studdetails;