import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentList = ({ user }) => {
  const [studdata, setStudData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState({});
  const [newStudentForm, setNewStudentForm] = useState({
    name: "",
    education: "",
    age: "",
    email: "",
    phone: "",
    courseId: "",
    batchId: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetch("http://localhost:8000/students")
      .then((res) => res.json())
      .then((resp) => setStudData(resp))
      .catch((err) => console.error("Failed to fetch students:", err.message));

    fetch("http://localhost:8000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.log(err.message));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/batches")
    .then((res) => res.json())
    .then((data) => setBatches(data))
    .catch((err) => console.log(err.message));
  }, [])

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewStudentSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudentForm),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add student");
        return res.json();
      })
      .then((newStudent) => {
        setStudData((prev) => [...prev, newStudent]);
        setShowAddModal(false);
        setNewStudentForm({ name: "", education: "", age: "", email: "", phone: "",     courseId: "",
          batchId: "", });
      })
      .catch((err) => console.error("Error adding student:", err.message));
  };

  const LoadDetail = (id) => {
    if (!id) return;
    fetch(`http://localhost:8000/students/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedStudentDetails(data);
        setShowDetailsModal(true);
      })
      .catch((err) => console.error("Error fetching details:", err.message));
  };

  const LoadEdit = (id) => {
    navigate(`/student/edit/${id}`);
  };

  const handleDeleteConfirmation = (id) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (!selectedItemId) return;

    fetch(`http://localhost:8000/students/${selectedItemId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete student");
        setStudData((prev) => prev.filter((item) => item.id !== selectedItemId));
        setShowDeleteModal(false);
      })
      .catch((err) => console.error("Error deleting student:", err.message));
  };

  return (
    <div className="container mt-4">
      <div className="card">
      <div className="card-title">
      <h2>Student List</h2>
      <div className="card-body">
        <Button onClick={() => setShowAddModal(true)} className="btn btn-success mb-3"
        style={{ marginBottom: "2px", padding: "4px", marginRight: "1090px"}}
        >
          Add New Student (+)
        </Button>
      <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Education</th>
            <th>Age</th>
            <th>Email</th>
            <th>Phone</th>
            <th>CourseId</th>
            <th>BatchId</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {studdata.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.education || "NA"}</td>
              <td>{student.age || "NA"}</td>
              <td>{student.email}</td>
              <td>{student.phone || "NA"}</td>
              <td>{student.courseId || "NA"}</td>
              <td>{student.batchId || "NA"}</td>
                <td>
                  <button onClick={() => LoadEdit(student.id)} className="btn btn-success">
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteConfirmation(student.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              <td>
                <button onClick={() => LoadDetail(student.id)} className="btn btn-info">
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/* Add Student Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleNewStudentSubmit}>
          <Modal.Body>
            {["name", "education", "age", "email", "phone"].map((field) => (
              <input
                key={field}
                type={field === "age" ? "number" : "text"}
                className="form-control mb-2"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={newStudentForm[field]}
                onChange={handleNewStudentChange}
                required
              />
            
            ))}
            <select
              className="form-control mb-2"
              id="courseId"
              name="courseId"
              value={newStudentForm['courseId']}
              onChange={handleNewStudentChange}
            >
              <option value="">
                Select a course
              </option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <select
              className="form-control mb-2"
              id="batchId"
              name="batchId"
              value={newStudentForm['batchId']}
              onChange={handleNewStudentChange}
            >
              <option value="">
                Select a batch
              </option>
              {batches.filter(item => item.courseId === newStudentForm.courseId).map((batch) => (
                <option key={batch.id} value={batch.batchName}>
                  {batch.batchName}
                </option>
              ))}
            </select>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Add Student
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this student?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Student Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.entries(selectedStudentDetails).map(([key, value]) => (
            <p key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value || "NA"}
            </p>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
    </div>
    </div>
  );
};

export default StudentList;
