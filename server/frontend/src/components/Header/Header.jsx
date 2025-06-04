import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [error, setError] = React.useState("");

  const handleLogout = async () => {
    try {
      setError("");
      await logout();
    } catch {
      setError("Failed to log out");
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <Link to="/" className="logo">
              Dealership
            </Link>
          </div>
          <div className="col-md-8">
            <nav className="nav">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/about" className="nav-link">
                About
              </Link>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
              {currentUser ? (
                <>
                  <Link to="/dealers" className="nav-link">
                    Dealers
                  </Link>
                  <button onClick={handleLogout} className="btn btn-link nav-link">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
