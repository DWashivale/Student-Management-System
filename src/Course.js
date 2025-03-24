import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Course = ({ user }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: "",
    instructor: "",
    description: "",
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if user is not present
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedCourse) {
      // Update existing course
      fetch(`http://localhost:8000/courses/${selectedCourse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseForm),
      })
        .then((res) => res.json())
        .then((data) => {
          const updatedCourses = courses.map((course) =>
            course.id === data.id ? data : course
          );
          setCourses(updatedCourses);
          setCourseForm({
            name: "",
            instructor: "",
            description: "",
          });
          setSelectedCourse(null);
          setShowModal(false);
        })
        .catch((err) => console.log(err.message));
    } else {
      // Add new course (Backend generates id automatically)
      fetch("http://localhost:8000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseForm),
      })
        .then((res) => res.json())
        .then((data) => {
          setCourses((prevCourses) => [...prevCourses, data]);
          setCourseForm({
            name: "",
            instructor: "",
            description: "",
          });
          setShowModal(false);
        })
        .catch((err) => console.log(err.message));
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      name: course.name,
      instructor: course.instructor,
      description: course.description,
    });
    setShowModal(true);
  };

  const handleDelete = (courseId) => {
    fetch(`http://localhost:8000/courses/${courseId}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedCourses = courses.filter(
          (course) => course.id !== courseId
        );
        setCourses(updatedCourses);
      })
      .catch((err) => console.log(err.message));
  };

  const handleShowDetails = (course) => {
    setCourseDetails(course);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    if (user) {
      fetch("http://localhost:8000/courses")
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .catch((err) => console.log(err.message));
    }
  }, [user]);

  if (!user) {
    return null; // Or a loader if you prefer
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-title">
          <h2>Course List</h2>
        </div>
        <div className="card-body">
            <div className="divbtn">
              <div className="d-flex justify-content-start mb-2">
                <Button
                  onClick={() => {
                    setSelectedCourse(null);
                    setShowModal(true);
                  }}
                  className="btn btn-success"
                  style={{ marginBottom: "4px", padding: "3px" }}
                >
                  Add New Course (+)
                </Button>
              </div>
            </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table table-dark table-hover">
                <tr>
                  <td>No</td>
                  <td>Course ID</td>
                  <td>Course Name</td>
                  <td>Instructor</td>
                  <td>Description</td>
                  <td>Edit</td>
                  <td>Delete</td>
                  <td>Details</td>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course.id}>
                    <td>{index + 1}</td>
                    <td>{course.id}</td>
                    <td>{course.name}</td>
                    <td>{course.instructor}</td>
                    <td>{course.description}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleEdit(course)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(course.id)}
                        >
                          Delete
                        </button>
                      </td>
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => handleShowDetails(course)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {selectedCourse ? "Edit Course" : "Add New Course"}
                </Modal.Title>
              </Modal.Header>
              <form onSubmit={handleFormSubmit}>
                <Modal.Body>
                  <div className="form-group">
                    <label htmlFor="name">Course Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={courseForm.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="instructor">Instructor</label>
                    <input
                      type="text"
                      className="form-control"
                      id="instructor"
                      name="instructor"
                      value={courseForm.instructor}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={courseForm.description}
                      onChange={handleInputChange}
                    />
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
                    {selectedCourse ? "Update Course" : "Add Course"}
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>
            <Modal
              show={showDetailsModal}
              onHide={() => setShowDetailsModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Course Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  <strong>Course Name:</strong> {courseDetails.name}
                </p>
                <p>
                  <strong>Instructor:</strong> {courseDetails.instructor}
                </p>
                <p>
                  <strong>Description:</strong> {courseDetails.description}
                </p>
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
            {/* Modals (Add/Edit, Details) */}
            {/* Same modal logic from your original code */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
