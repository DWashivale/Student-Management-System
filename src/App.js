import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentList from "./StudentList";
import Registration from "./Registration";
import Login from "./Login";
import Course from "./Course";
import BatchList from "./BatchList";
import UserDetails from "./UserDetails";
import Navbar from "./Navbar"; // Import Navbar

function App() {
  const [user, setUser] = useState(sessionStorage.getItem("user"));

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <BrowserRouter>
      <div className="App">
        {/* Show Navbar only if the user is logged in */}
        {user && <Navbar onLogout={handleLogout} />}

        <Routes>
          <Route exact path="/" element={<StudentList user={user} />} />
          <Route exact path="/login" element={<Login setUser={setUser} />} />
          <Route exact path="/signup" element={<Registration setUser={setUser} />} />
          <Route path="/Course" element={<Course user={user} />} />
          <Route path="/BatchList" element={<BatchList user={user} />} />
          <Route path="/userdetails/:id" element={<UserDetails user={user}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
