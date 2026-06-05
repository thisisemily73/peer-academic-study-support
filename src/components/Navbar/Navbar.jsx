import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
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
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/signup" className="get-started-btn">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}