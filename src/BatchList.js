import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const BatchList = ({ onBatchAdded, user }) => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [batchForm, setBatchForm] = useState({
    batchName: "",
    courseName: "",
  });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [detailsBatch, setDetailsBatch] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBatchForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

 const handleFormSubmit = (e) => {
  e.preventDefault();

  // If there's no selectedBatch (i.e., we're adding a new batch), generate a new ID
  if (!selectedBatch) {
    const newBatchId = Math.random().toString(36).substr(2, 9); // Generate random batchId

    const newBatch = {
      ...batchForm,
      batchId: newBatchId, // Set the generated batchId
    };

    fetch("http://localhost:8000/batches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBatch),
    })
      .then((res) => res.json())
      .then((data) => {
        setBatches((prevBatches) => [...prevBatches, data]);
        setBatchForm({ batchName: "", courseName: "" });
        setShowModal(false);
        onBatchAdded(data.batchName);
      })
      .catch((err) => console.log(err.message));
  } else {
    // If we are editing an existing batch, update it
    fetch(`http://localhost:8000/batches/${selectedBatch.batchId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchForm),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedBatches = batches.map((batch) =>
          batch.batchId === selectedBatch.batchId ? data : batch
        );
        setBatches(updatedBatches);
        setBatchForm({ batchName: "", courseName: "" });
        setShowModal(false);
      })
      .catch((err) => console.log(err.message));
  }
};


  const handleEdit = (batch) => {
    setSelectedBatch(batch);
    setBatchForm({
      batchName: batch.batchName,
      courseName: batch.courseName,
      batchId: batch.batchId,
    });
    setShowModal(true);
  };

  const handleDelete = (batchId) => {
    fetch(`http://localhost:8000/batches/${batchId}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedBatches = batches.filter(
          (batch) => batch.batchId !== batchId
        );
        setBatches(updatedBatches);
      })
      .catch((err) => console.log(err.message));
  };

  const handleDetails = (batch) => {
    setDetailsBatch(batch);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    fetch("http://localhost:8000/batches")
      .then((res) => res.json())
      .then((data) => setBatches(data))
      .catch((err) => console.log(err.message));

    fetch("http://localhost:8000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.log(err.message));
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
          <h2>Batch List</h2>
        </div>
        <div className="card-body">
          <div className="divbtn">
          <div className="d-flex justify-content-start mb-2">
            <Button
              onClick={() => {
                setSelectedBatch(null);
                setBatchForm({ batchName: "", courseName: "" });
                setShowModal(true);
              }}
              className="btn btn-success"
              style={{ marginBottom: "4px", padding: "3px" }}
            >
              Add New Batch (+)
            </Button>
            </div>
          </div>
          {/* Add table-responsive class here */}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead
                className="table table-dark table-hover"
                style={{ backgroundColor: "red" }}
              >
                <tr>
                  <td>No</td>
                  <td>Batch ID</td>
                  <td>Batch Name</td>
                  <td>Course Name</td>
                  <td>Edit</td>
                  <td>Delete</td>
                  <td>Details</td>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch, index) => (
                  <tr key={batch.batchId}>
                    <td>{index + 1}</td>
                    <td>{batch.batchId}</td>
                    <td>{batch.batchName}</td>
                    <td>{batch.courseName}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => handleEdit(batch)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(batch.batchId)}
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => handleDetails(batch)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedBatch ? "Edit Batch" : "Add New Batch"}
              </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleFormSubmit}>
              <Modal.Body>
                <div className="form-group">
                  <label htmlFor="batchName">Batch Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="batchName"
                    name="batchName"
                    value={batchForm.batchName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="courseName">Select Course</label>
                  <select
                    className="form-control"
                    id="courseName"
                    name="courseName"
                    value={batchForm.courseName}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select a course
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="success" type="submit">
                  {selectedBatch ? "Update Batch" : "Add Batch"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <Modal
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Batch Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {detailsBatch && (
                <>
                  <p>
                    <strong>Batch ID:</strong> {detailsBatch.batchId}
                  </p>
                  <p>
                    <strong>Batch Name:</strong> {detailsBatch.batchName}
                  </p>
                  <p>
                    <strong>Course Name:</strong> {detailsBatch.courseName}
                  </p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default BatchList;
