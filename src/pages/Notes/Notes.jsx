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
    const [filterType, setFilterType] =
        useState("subject");

    const [filterValue, setFilterValue] =
        useState("All");

    const [activeFilters, setActiveFilters] =
        useState([]);

    const [resources, setResources] = useState([]);
    const [savedResources, setSavedResources] = useState([]);

    const filteredResources = resources.filter(
        (resource) => {

            const matchesSearch =
                resource.title
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesFilters =
                activeFilters.every(filter => {

                    return (
                        resource[
                        filter.type
                        ] === filter.value
                    );

                });

            return (
                matchesSearch &&
                matchesFilters
            );

        }
    );

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

    const handleAddFilter = () => {

        if (filterValue === "All")
            return;

        const exists =
            activeFilters.some(
                filter =>

                    filter.type ===
                    filterType

                    &&

                    filter.value ===
                    filterValue
            );

        if (exists) return;

        setActiveFilters([
            ...activeFilters,

            {
                type: filterType,

                value: filterValue
            }
        ]);
    };



    const removeFilter = (index) => {

        setActiveFilters(

            activeFilters.filter(
                (_, i) => i !== index
            )

        );

    };



    const removeAllFilters = () => {

        setActiveFilters([]);

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

                    <div className="filter-bar">

                        <label>

                            Filter

                        </label>

                        <select

                            value={filterType}

                            onChange={(e) =>

                                setFilterType(
                                    e.target.value
                                )

                            }

                        >

                            <option value="subject">

                                Subject

                            </option>

                            <option value="level">

                                Level

                            </option>

                            <option value="subtopic">

                                Subtopic

                            </option>

                        </select>



                        <select

                            value={filterValue}

                            onChange={(e) =>

                                setFilterValue(
                                    e.target.value
                                )

                            }

                        >

                            <option>

                                All

                            </option>

                            {[

                                ...new Set(

                                    resources.map(

                                        r =>

                                            r[filterType]

                                    )

                                )

                            ]

                                .sort()

                                .map(value => (

                                    <option key={value}>

                                        {value}

                                    </option>

                                ))}

                        </select>



                        <button

                            className="add-filter-btn"

                            onClick={handleAddFilter}

                        >

                            + Add

                        </button>



                        <button

                            className="clear-filter-btn"

                            onClick={removeAllFilters}

                        >

                            Remove All

                        </button>

                    </div>

                    <div className="resource-grid">

                        {filteredResources.length === 0 ? (

                            <div className="empty-state">

                                <h2>📚 No resources found</h2>

                                <p>
                                    Try changing your filters or be the first
                                    to upload a resource!
                                </p>

                                <Link to="/upload">

                                    <button className="primary-btn">

                                        Upload Resource

                                    </button>

                                </Link>

                            </div>

                        ) : (

                            filteredResources.map((resource) => (

                                <div
                                    key={resource.id}
                                    className="resource-card"
                                >

                                    <h3>{resource.title}</h3>

                                    <div className="resource-tags">

                                        <span>{resource.subject}</span>

                                        <span>{resource.level}</span>

                                        <span>{resource.subtopic}</span>

                                    </div>

                                    <p>{resource.description}</p>

                                    <p className="resource-domain">

                                        🌐 {

                                            new URL(resource.fileUrl)
                                                .hostname
                                                .replace("www.", "")

                                        }

                                    </p>

                                    <div className="resource-actions">

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

                                            {

                                                savedResources.includes(resource.id)

                                                    ? "★ Saved"

                                                    : "☆ Save"

                                            }

                                        </button>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>
                </div>
            </section>
        </Layout>
    );
}