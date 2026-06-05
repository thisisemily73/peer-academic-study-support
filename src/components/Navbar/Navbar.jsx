import "./Navbar.css";

export default function Navbar() {
  return (
    <nav>
      <div className="nav-container">
        <div className="logo">PASS</div>

        <div className="nav-links">
          <a href="#">Notes</a>
          <a href="#">SAT Prep</a>
          <a href="#">Community</a>
          <a href="#">Dashboard</a>
        </div>

        <div className="nav-actions">
          <button className="login-btn">
            Login
          </button>

          <button className="get-started-btn">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}