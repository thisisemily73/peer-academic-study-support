import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-brand">
          <h2>PASS</h2>
          <p>
            Peer Academic Study Support
          </p>
        </div>

        <div className="footer-links">
          <Link to="/notes">Notes</Link>
          <Link to="/sat-prep">SAT Prep</Link>
          <Link to="/community">Community</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/feedback">Feedback</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 PASS. All rights reserved.
      </div>
    </footer>
  );
}