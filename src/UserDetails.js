import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

const UserDetails = (user) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [userDetails, setUserDetails] = useState([]);
  console.log(userDetails)
  const [loading, setLoading] = useState(true); // For better user experience
  const [error, setError] = useState(null);
  
   useEffect(() => {
      if (!user) {
        navigate("/login");
      }
    }, [user, navigate]);
  useEffect(() => {
    // Fetch students, batches, and courses data
    Promise.all([
      fetch("http://localhost:8000/students").then((res) => res.json()),
      fetch("http://localhost:8000/batches").then((res) => res.json()),
      fetch("http://localhost:8000/courses").then((res) => res.json()),
    ])
      .then(([studentsData, batchesData, coursesData]) => {
        console.log(studentsData, batchesData, coursesData)
        // Map students to their corresponding batches and courses
        const userDetails = studentsData.map((student) => {
          // Match batch
          const batch = batchesData.find(
            (batch) => batch.batchId === student.batchId        
          );

          // Match course
          const course = coursesData.find(
            (course) => course.id === student.courseId
          );

          return {
            ...student,
            batchName: batch?.batchName || "N/A",
            courseName: course?.name || "N/A",
          };
        });

        setUserDetails(userDetails);
        setLoading(false); // Loading complete
      })
      .catch((err) => {
        setError("Failed to fetch data.");
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // eslint-disable-next-line
  const handleLogout = () => {
    // You can perform the logout actions here (e.g., clear session, update user state)
    sessionStorage.removeItem("user");
    navigate("/login"); // Redirect to the login page after logout
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-title">
          <h2>User Details</h2>
          {/* Logout button to trigger the logout functionality */}
        
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Education</th>
                  <th>Age</th>
                  <th>Batch Name</th>
                  <th>Course Name</th>
                </tr>
              </thead>
              <tbody>
                {userDetails.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.education || "N/A"}</td>
                    <td>{student.age || "N/A"}</td>
                    <td>{student.batchName}</td>
                    <td>{student.courseName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
