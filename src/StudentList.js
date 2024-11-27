import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentList = ({ user }) => {
  const [studdata, studdatachange] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false); // Separate state for Add Student modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Separate state for Delete confirmation modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState({});
  const [newStudentForm, setNewStudentForm] = useState({
    name: "",
    education: "",
    age: "",
    email: "",
    phone: "",
  }); // State for the new student form
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if user is not present
    }
  }, [user, navigate]);

  const LoadDetail = (id) => {
    fetch(`http://localhost:8000/students/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedStudentDetails(data);
        setShowDetailsModal(true);
      })
      .catch((err) => console.log(err.message));
  };

  const LoadEdit = (id) => {
    navigate("/student/edit/" + id);
  };

  const handleDeleteConfirmation = (id) => {
    setSelectedItemId(id);
    setShowDeleteModal(true); // Show delete confirmation modal
  };

  const handleDelete = () => {
    fetch("http://localhost:8000/students/" + selectedItemId, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Remove the deleted student from the state
          studdatachange((prevData) =>
            prevData.filter((item) => item.id !== selectedItemId)
          );
          setShowDeleteModal(false); // Close the delete modal
        } else {
          console.error("Failed to delete student");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudentForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
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
      .then((res) => res.json())
      .then((data) => {
        studdatachange((prevData) => [...prevData, data]); // Update the student data
        setNewStudentForm({
          name: "",
          education: "",
          age: "",
          email: "",
          phone: "",
        }); // Reset form
        setShowAddModal(false); // Close add modal
        navigate("/course"); // Redirect to Course component after adding student
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    fetch("http://localhost:8000/students")
      .then((res) => res.json())
      .then((resp) => {
        studdatachange(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  if (!user) {
    return <div>Please login to view the student list</div>;
  }

  return (
    <div className="bg">
      <div className="container">
        <div className="card">
          <div className="card-title">
            <h2>Student List</h2>
          </div>
          <div className="card-body">
            <div className="divbtn">
              {user.type === "admin" && ( // Add New Student button only for admin
                <div className="d-flex justify-content-start mb-2">
                  <Button
                    onClick={() => {
                      setNewStudentForm({
                        name: "",
                        education: "",
                        age: "",
                        email: "",
                        phone: "",
                      }); // Reset the form
                      setShowAddModal(true); // Show add modal
                    }}
                    className="btn btn-success"
                    style={{ marginBottom: "4px", padding: "3px" }}
                  >
                    Add New Student (+)
                  </Button>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead
                      className="table table-dark table-hover"
                      style={{ backgroundColor: "red" }}
                    >
                      <tr>
                        <td>No</td>
                        <td>Id</td>
                        <td>Name</td>
                        <td>Education</td>
                        <td>Age</td>
                        <td>Email Id</td>
                        <td>Phone</td>
                        {user.type === "admin" && <td>Edit</td>}
                        {user.type === "admin" && <td>Delete</td>}
                        {user.type === "admin" && <td>Details</td>}/
                      </tr>
                    </thead>
                    <tbody>
                      {studdata &&
                        studdata.map((item, i) => (
                          <tr key={item.id}>
                            <td>{i + 1}</td>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.education || "NA"}</td>
                            <td>{item.age || "NA"}</td>
                            <td>{item.email}</td>
                            <td>{item.phone || "NA"}</td>
                            {user.type === "admin" && (
                              <td>
                                <button
                                  onClick={() => LoadEdit(item.id)}
                                  className="btn btn-success"
                                >
                                  Edit
                                </button>
                              </td>
                            )}
                            {user.type === "admin" && (
                              <td>
                                <button
                                  onClick={() => handleDeleteConfirmation(item.id)}
                                  className="btn btn-danger"
                                >
                                  Delete
                                </button>
                              </td>
                            )}
                            {user.type === "admin" && (
                              <td>
                                <button
                                  className="btn btn-info"
                                  onClick={() => LoadDetail(item.id)}
                                >
                                  Details
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Modal for adding a new student */}
                <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add New Student</Modal.Title>
                  </Modal.Header>
                  <form onSubmit={handleNewStudentSubmit}>
                    <Modal.Body>
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={newStudentForm.name}
                          onChange={handleNewStudentChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="education">Education</label>
                        <input
                          type="text"
                          className="form-control"
                          id="education"
                          name="education"
                          value={newStudentForm.education}
                          onChange={handleNewStudentChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input
                          type="number"
                          className="form-control"
                          id="age"
                          name="age"
                          value={newStudentForm.age}
                          onChange={handleNewStudentChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={newStudentForm.email}
                          onChange={handleNewStudentChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          id="phone"
                          name="phone"
                          maxLength={10}
                          value={newStudentForm.phone}
                          onChange={handleNewStudentChange}
                          required
                        />
                      </div>
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

                {/* Modal for showing student details */}
                <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Student Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>Id: {selectedStudentDetails.id}</p>
                    <p>Name: {selectedStudentDetails.name}</p>
                    <p>Education: {selectedStudentDetails.education || "NA"}</p>
                    <p>Age: {selectedStudentDetails.age || "NA"}</p>
                    <p>Email: {selectedStudentDetails.email}</p>
                    <p>Phone: {selectedStudentDetails.phone || "NA"}</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                {/* Confirmation Modal for Delete */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
