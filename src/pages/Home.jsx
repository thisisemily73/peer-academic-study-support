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
            <section className="features">
                <div className="container">
                    <h2>Everything Students Need</h2>

                    <p className="features-subtitle">
                        One platform for learning, studying,
                        collaborating, and achieving academic success.
                    </p>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <h3>📚 Notes</h3>
                            <p>
                                Discover and share study guides,
                                class notes, and academic resources.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3>🎯 SAT Prep</h3>
                            <p>
                                Practice questions, track progress,
                                and prepare with confidence.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3>👥 Community</h3>
                            <p>
                                Connect with students, ask questions,
                                and join study discussions.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3>📈 Dashboard</h3>
                            <p>
                                Organize resources, monitor goals,
                                and stay on top of your studies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}