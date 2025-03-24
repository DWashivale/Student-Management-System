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
    courseId: "",
  });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [detailsBatch, setDetailsBatch] = useState(null);

  console.log('selected batct', selectedBatch)

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

    if (!selectedBatch) {
      const newBatchId = Math.random().toString(36).substr(2, 9);
      const newBatch = { ...batchForm, id: newBatchId };

      fetch("http://localhost:8000/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBatch),
      })
        .then((res) => res.json())
        .then((data) => {
          setBatches((prevBatches) => [...prevBatches, data]);
          setBatchForm({ batchName: "", courseId: "" });
          setShowModal(false);
          onBatchAdded(data.batchName);
        })
        .catch((err) => console.log(err.message));
    } else {
      fetch(`http://localhost:8000/batches/${selectedBatch.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...batchForm}),
      })
        .then((res) => res.json())
        .then((data) => {
          const updatedBatches = batches.map((batch) =>
            batch.id === selectedBatch.id ? data : batch
          );
          setBatches(updatedBatches);
          setBatchForm({ batchName: "", courseId: "" });
          setShowModal(false);
        })
        .catch((err) => console.log(err.message));
    }
  };

  const handleEdit = (batch) => {
    setSelectedBatch(batch);
    setBatchForm({
      batchName: batch.batchName,
      courseId: batch.courseId,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/batches/${id}`, { method: "DELETE" })
      .then(() => {
        setBatches((prevBatches) =>
          prevBatches.filter((batch) => batch.id !== id)
        );
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

  if (!user) return null;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-title">
          <h2>Batch List</h2>
        </div>
        <div className="card-body">
            <div className="divbtn">
              <Button 
                onClick={() => {
                  setSelectedBatch(null);
                  setBatchForm({ batchName: "", courseId: "" });
                  setShowModal(true);
                }}
                className="btn btn-success"
                style={{ marginBottom: "8px", padding: "3px", marginRight: "1100px"}}
              >
                Add New Batch (+)
              </Button>
            </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <td>No</td>
                  <td>Batch ID</td>
                  <td>Batch Time</td>
                  <td>Course Id</td>
                  <td>Edit</td>
                  <td>Delete</td>
                  <td>Details</td>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch, index) => (
                  <tr key={batch.id}>
                    <td>{index + 1}</td>
                    <td>{batch.id}</td>
                    <td>{batch.batchName}</td>
                    <td>
                      {courses.find((course) => course.id === batch.courseId)?.name || "NA"}
                    </td>
                    {/* <td>{batch.courseId}</td> */}
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
                          onClick={() => handleDelete(batch.id)}
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
                  <label htmlFor="batchName">Batch Time</label>
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
                  <label htmlFor="courseId">Select Course</label>
                  <select
                    className="form-control"
                    id="courseId"
                    name="courseId"
                    value={batchForm.courseId}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select a course
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="success" type="submit">
                  {selectedBatch ? "Update Batch" : "Add Batch"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Batch Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {detailsBatch && (
                <>
                  <p>
                    <strong>Batch ID:</strong> {detailsBatch.id}
                  </p>
                  <p>
                    <strong>Batch Name:</strong> {detailsBatch.batchName}
                  </p>
                  <p>
                    <strong>Course Name:</strong> {detailsBatch.courseId}
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
