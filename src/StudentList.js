import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentList = ({ user }) => {
  const [studdata, studdatachange] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const navigate = useNavigate();

  const LoadDetail = (id) => {
    navigate("/student/detail/" + id);
  };

  const LoadEdit = (id) => {
    navigate("/student/edit/" + id);
  };

  const handleDeleteConfirmation = (id) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    fetch("http://localhost:8000/students/" + selectedItemId, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.message);
      });
    setShowModal(false);
  };

  useEffect(() => {
    fetch("http://localhost:8000/students")
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
    <div
      className="bg"
    >
      <div className="container">
        <div className="card">
          <div className="card-title">
            <h2>Student List</h2>
          </div>
          {user ? (
            <div className="card-body">
              <div className="row">
                <div className="col-md-2">
                  <Link
                    to="student/create"
                    className="btn btn-success mb-1"
                  >
                    Add New (+)
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
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
                        <td>Edit</td>
                        <td>Delete</td>
                        <td>Details</td>
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
                            <td>
                              <button
                                onClick={() => {
                                  LoadEdit(item.id);
                                }}
                                className="btn btn-success"
                              >
                                Edit{" "}
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  handleDeleteConfirmation(item.id);
                                }}
                                className="btn btn-danger"
                              >
                                Delete{""}
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  LoadDetail(item.id);
                                }}
                                className="btn btn-success"
                              >
                                Details{" "}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Deleting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                      >
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
          ) : (
            <div>Please login to view student list</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
