import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Community Hub</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {token ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/posts">Community Posts</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/help-requests">Help Requests</Link></li>
                <li className="nav-item"><button className="btn btn-danger" onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/signup">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
