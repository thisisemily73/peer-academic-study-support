import "./Navbar.css";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import { useState } from "react";


export default function Navbar() {
  const { currentUser } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
        <Link
          to="/"
          className="logo"
          onClick={() => setMenuOpen(false)}
        >
          PASS
        </Link>

        <div className={menuOpen ? "nav-links open" : "nav-links"}>
          <Link
            to="/notes"
            onClick={() => setMenuOpen(false)}
          >
            Notes
          </Link>

          <Link
            to="/sat-prep"
            onClick={() => setMenuOpen(false)}
          >
            SAT Prep
          </Link>

          <Link
            to="/community"
            onClick={() => setMenuOpen(false)}
          >
            Community
          </Link>

          <Link
            to="/upload"
            onClick={() => setMenuOpen(false)}
          >
            Upload
          </Link>

          <div className="mobile-only">

            <button
              onClick={toggleTheme}
              className="mobile-theme-btn"
            >

              {darkMode

                ? "☀️ Light Mode"

                : "🌙 Dark Mode"}

            </button>


            {currentUser ? (

              <>

                <Link

                  to="/profile"

                  className="mobile-link"

                  onClick={() => setMenuOpen(false)}

                >

                  Profile

                </Link>


                <button

                  onClick={handleLogout}

                  className="mobile-logout-btn"

                >

                  Logout

                </button>

              </>

            ) : (

              <>

                <Link

                  to="/login"

                  className="mobile-link"

                >

                  Login

                </Link>


                <Link

                  to="/signup"

                  className="mobile-link"

                >

                  Get Started

                </Link>

              </>

            )}

          </div>
        </div>

        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

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