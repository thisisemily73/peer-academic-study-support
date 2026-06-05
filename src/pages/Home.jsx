import Navbar from "../components/Navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-tag">
              Student Learning Platform
            </span>

            <h1>
              Learn.
              <br />
              Share.
              <br />
              Succeed.
            </h1>

            <p>
              PASS brings together study resources,
              SAT preparation, academic communities,
              and productivity tools into one platform
              designed for students.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn">
                Get Started
              </button>

              <button className="secondary-btn">
                Explore Resources
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}