import "./Navbar.css";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { currentUser } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) return;

    try {
      await signOut(auth);

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out.");
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
          <button
            onClick={toggleTheme}
            className="theme-toggle"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

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