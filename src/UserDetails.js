import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    // Fetch students, batches, and courses data
    Promise.all([
      fetch("http://localhost:8000/students").then((res) => res.json()),
      fetch("http://localhost:8000/batches").then((res) => res.json()),
      fetch("http://localhost:8000/courses").then((res) => res.json())
    ])
      .then(([studentsData, batchesData, coursesData]) => {
        // Match students with batches and courses
        const userDetails = studentsData.map((student) => {
          // Ensure that 'student.batchId' matches the right property in 'batchesData'
          const batch = batchesData.find(
            (batch) => batch.batchId === student.batchId // Ensure correct comparison
          );
  
          // Ensure that 'student.courseId' matches the right property in 'coursesData'
          const course = coursesData.find(
            (course) => course.id === student.courseId // Ensure correct comparison
          );
  
          // Add logging to debug
          console.log(`Student: ${student.name}, Batch: ${batch ? batch.batchName : "N/A"}, Course: ${course ? course.name : "N/A"}`);
  
          return {
            ...student,
            batchName: batch ? batch.name : "N/A",  // Use correct batch name property
            courseName: course ? course.name : "N/A"  // Use correct course name property
          };
        });
        setUserDetails(userDetails);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err.message);
      });
  }, []);
  

  return (
    <div className="container mt-4">
      <h2>User Details</h2>
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
  );
};

export default UserDetails;
