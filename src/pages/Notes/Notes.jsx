import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import resources from "../../data/resources";
import "./Notes.css";
import { Link } from "react-router-dom";

export default function Notes() {
    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState("All");

    const filteredResources = resources.filter((resource) => {
        const matchesSearch =
            resource.title
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesSubject =
            subject === "All" ||
            resource.subject === subject;

        return matchesSearch && matchesSubject;
    });

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
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="filter-row">
                        <select
                            value={subject}
                            onChange={(e) =>
                                setSubject(e.target.value)
                            }
                        >
                            <option>All</option>
                            <option>Biology</option>
                            <option>Economics</option>
                            <option>SAT</option>
                            <option>Mathematics</option>
                            <option>Computer Science</option>
                        </select>

                        <Link to="/upload">
                            <button className="primary-btn">
                                Upload Resource
                            </button>
                        </Link>
                    </div>

                    <div className="resource-grid">
                        {filteredResources.map((resource) => (
                            <div
                                key={resource.id}
                                className="resource-card"
                            >
                                <h3>{resource.title}</h3>

                                <p>{resource.subject}</p>

                                <p>{resource.level}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}