import Layout from "../../components/Layout/Layout";

import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";

import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp
} from "firebase/firestore";

import "./Notes.css";
import { Link } from "react-router-dom";

export default function Notes() {
    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState("All");

    const [resources, setResources] = useState([]);

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

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const querySnapshot = await getDocs(
                    collection(db, "notes")
                );

                const notes = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setResources(notes);
            } catch (error) {
                console.error("Error loading notes:", error);
            }
        };

        fetchNotes();
    }, []);

    const handleSave = async (resource) => {
        const user = auth.currentUser;

        if (!user) {
            toast.error("Please log in to save resources.");
            return;
        }

        try {
            await addDoc(
                collection(db, "savedResources"),
                {
                    userId: user.uid,
                    noteId: resource.id,
                    savedAt: serverTimestamp()
                }
            );

            toast.success("Resource saved!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save resource.");
        }
    };

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

                                <p>
                                    {resource.subject}
                                    {" • "}
                                    {resource.level}
                                    {" "}
                                    {resource.subtopic}
                                </p>

                                <p>{resource.description}</p>

                                <a
                                    href={resource.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="open-resource-btn"
                                >
                                    Open Resource
                                </a>
                                <button
                                    className="save-btn"
                                    onClick={() => handleSave(resource)}
                                >
                                    ⭐ Save
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}