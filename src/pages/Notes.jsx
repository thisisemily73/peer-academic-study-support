import Layout from "../components/Layout/Layout";

export default function Notes() {
  return (
    <Layout>
      <section className="notes-page">
        <div className="container">
          <h1>Study Resources</h1>

          <p className="notes-subtitle">
            Discover notes, study guides, formula sheets,
            and other academic resources shared by students.
          </p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search resources..."
            />
          </div>

          <div className="resource-grid">
            <div className="resource-card">
              <h3>Biology Unit 3 Notes</h3>
              <p>Biology • Grade 10</p>
            </div>

            <div className="resource-card">
              <h3>AP Macro Unit 2 Review</h3>
              <p>Economics • AP</p>
            </div>

            <div className="resource-card">
              <h3>SAT Grammar Cheat Sheet</h3>
              <p>SAT Prep</p>
            </div>

            <div className="resource-card">
              <h3>Geometry Formula Guide</h3>
              <p>Mathematics</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}