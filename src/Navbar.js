import { Link } from "react-router-dom";
import "./Navbar.css"; // Optional: Add CSS for styling

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <h4>Student Management System</h4>
      <div className="nav-links">
        <Link className="btn btn-outline-primary text-uppercase fw-bold" to="/">
          Student List
        </Link>
        <Link className="btn btn-outline-primary text-uppercase fw-bold" to="/Course">
          Course List
        </Link>
        <Link className="btn btn-outline-primary text-uppercase fw-bold" to="/BatchList">
          Batch List
        </Link>
        <Link className="btn btn-outline-primary text-uppercase fw-bold" to="/userdetails/:id">
          User Details
        </Link>
        <button
         
          className="btn btn-outline-danger text-uppercase fw-bold logoutbtn " 
          style = {{marginLeft : "500px"}}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
