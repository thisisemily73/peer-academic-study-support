import "./Navbar.css";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function Navbar() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) return;

    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="logo">
          PASS
        </Link>

        <div className="nav-links">
          <Link to="/notes">Notes</Link>
          <Link to="/sat-prep">SAT Prep</Link>
          <Link to="/community">Community</Link>
          <Link to="/upload">Upload</Link>
        </div>

        <div className="nav-actions">
          {currentUser ? (
            <>
              <Link to="/profile" className="profile-link">
                {currentUser.displayName}
              </Link>

              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>

              <Link to="/signup" className="get-started-btn">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}