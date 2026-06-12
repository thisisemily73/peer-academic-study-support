import Layout from "../../components/Layout/Layout";

import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    serverTimestamp,
    query,
    where
} from "firebase/firestore";

import "./Notes.css";
import { Link } from "react-router-dom";

export default function Notes() {
    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState("All");
    const [level, setLevel] = useState("All");
    const [subtopic, setSubtopic] = useState("All");

    const [resources, setResources] = useState([]);
    const [savedResources, setSavedResources] = useState([]);

    const filteredResources = resources.filter((resource) => {
        const matchesSearch =
            resource.title
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesSubject =
            subject === "All" ||
            resource.subject === subject;

        const matchesLevel =
            level === "All" ||
            resource.level === level;

        const matchesSubtopic =
            subtopic === "All" ||
            resource.subtopic === subtopic;

        return (
            matchesSearch &&
            matchesSubject &&
            matchesLevel &&
            matchesSubtopic
        );
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
                toast.error("Error loading notes.");
                console.error("Error loading notes:", error);
            }
        };

        fetchNotes();
    }, []);

    useEffect(() => {
        const fetchSavedResources = async () => {
            const user = auth.currentUser;

            if (!user) return;

            try {
                const savedSnapshot = await getDocs(
                    query(
                        collection(db, "savedResources"),
                        where("userId", "==", user.uid)
                    )
                );

                const savedIds = savedSnapshot.docs.map(
                    doc => doc.data().noteId
                );

                setSavedResources(savedIds);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSavedResources();
    }, []);

    const handleSave = async (resource) => {
        const user = auth.currentUser;

        if (!user) {
            toast.error("Please log in to save resources.");
            return;
        }

        try {
            const existingQuery = query(
                collection(db, "savedResources"),
                where("userId", "==", user.uid),
                where("noteId", "==", resource.id)
            );

            const existingDocs = await getDocs(existingQuery);

            // UNSAVE
            if (!existingDocs.empty) {
                await deleteDoc(existingDocs.docs[0].ref);

                setSavedResources(prev =>
                    prev.filter(id => id !== resource.id)
                );

                toast.info(
                    "Removed from saved resources."
                );

                return;
            }

            // SAVE
            await addDoc(
                collection(db, "savedResources"),
                {
                    userId: user.uid,
                    noteId: resource.id,
                    savedAt: serverTimestamp()
                }
            );

            setSavedResources(prev => [
                ...prev,
                resource.id
            ]);

            toast.success("Resource saved!");

        } catch (error) {
            console.error(error);
            toast.error(
                "Failed to update saved resource."
            );
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

                        <div className="filter-group">
                            <label>Subject</label>

                            <select
                                value={subject}
                                onChange={(e) =>
                                    setSubject(e.target.value)
                                }
                            >
                                <option>All</option>

                                {[...new Set(
                                    resources.map(
                                        resource => resource.subject
                                    )
                                )]
                                    .sort()
                                    .map((subject) => (
                                        <option key={subject}>
                                            {subject}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Level</label>

                            <select
                                value={level}
                                onChange={(e) =>
                                    setLevel(e.target.value)
                                }
                            >
                                <option>All</option>

                                {[...new Set(
                                    resources.map(
                                        resource => resource.level
                                    )
                                )]
                                    .sort()
                                    .map((level) => (
                                        <option key={level}>
                                            {level}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Subtopic</label>

                            <select
                                value={subtopic}
                                onChange={(e) =>
                                    setSubtopic(e.target.value)
                                }
                            >
                                <option>All</option>

                                {[...new Set(
                                    resources.map(
                                        resource => resource.subtopic
                                    )
                                )]
                                    .sort()
                                    .map((topic) => (
                                        <option key={topic}>
                                            {topic}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="upload-filter-action">
                            <Link to="/upload">
                                <button className="primary-btn">
                                    Upload Resource
                                </button>
                            </Link>
                        </div>

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
                                    className={`save-btn ${savedResources.includes(resource.id)
                                        ? "saved"
                                        : ""
                                        }`}
                                    onClick={() => handleSave(resource)}
                                >
                                    {savedResources.includes(resource.id)
                                        ? "★ Saved"
                                        : "☆ Save"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}