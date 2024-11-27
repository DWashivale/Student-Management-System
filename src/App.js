import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import StudentList from './StudentList';
import Studcreate from './Studcreate';
import Studedit from './Studedit';
import Registration from './Registration';
import Login from './Login';
import Studdetails from './Studdetails';
import Course from './Course';
import BatchList from './BatchList';
import UserDetails from './UserDetails';

function App() { 
  const [user, setUser] = useState(sessionStorage.getItem("user"));

  return (
    <div className="App">
      <BrowserRouter>
        <div className="header-wrapper">
          <h1>Student Management System</h1>
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
          </div>
          {user ? (
            <div className="user-info">
              <div>{user.name}</div>
              <div
                className="btn btn-outline-primary text-uppercase fw-bold"
                onClick={() => {
                  setUser(null);
                  sessionStorage.removeItem("user");
                }}
              >
                Logout
              </div>
            </div>
          ) : (
            <Link className="btn btn-outline-primary text-uppercase fw-bold mt-2" to="/login">
              Log in
            </Link>
          )}
        </div>
        <Routes>
          <Route exact path="/" element={<StudentList user={user} />} />
          <Route exact path="/login" element={<Login setUser={setUser} />} />
          <Route exact path="/signup" element={<Registration setUser={setUser} />} />
          <Route path="/student/create" element={<Studcreate />} />
          <Route path="/Course" element={<Course  user={user}/>} />
          <Route path="/BatchList" element={<BatchList  user={user}/> }/>
          <Route path="/student/detail/:studid" element={<Studdetails />} />
          <Route path="/student/edit/:studid" element={<Studedit />} />
          <Route path="/userdetails/:id" element = {<UserDetails/>} />
        </Routes>
      </BrowserRouter>
    
    </div>
  );
}

export default App;
