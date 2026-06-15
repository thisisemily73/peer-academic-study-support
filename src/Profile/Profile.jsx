import Layout from "../components/Layout/Layout";
import "./Profile.css";
import { useAuth } from "../context/AuthContext";

import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    where
} from "firebase/firestore";

import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { updateDoc } from "firebase/firestore";

export default function Profile() {
    const { currentUser } = useAuth();
    const [uploads, setUploads] = useState([]);
    const [savedResources, setSavedResources] = useState([]);
    const navigate = useNavigate();

    const [editingId, setEditingId] = useState(null);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editFileUrl, setEditFileUrl] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editSubject, setEditSubject] = useState("");
    const [editSubtopic, setEditSubtopic] = useState("");
    const [editLevel, setEditLevel] = useState("");

    const subtopics = {
        Mathematics: [
            "Algebra I",
            "Algebra II",
            "Geometry",
            "Precalculus",
            "Calculus AB",
            "Calculus BC",
            "Statistics"
        ],

        Science: [
            "Biology",
            "Chemistry",
            "Physics",
            "Environmental Science"
        ],

        English: [
            "Literature",
            "Writing",
            "Grammar"
        ],

        History: [
            "World History",
            "US History",
            "Government"
        ],

        Economics: [
            "Microeconomics",
            "Macroeconomics"
        ],

        "Computer Science": [
            "Programming",
            "Data Structures",
            "Web Development"
        ],

        SAT: [
            "Reading",
            "Writing",
            "Algebra",
            "Advanced Math",
            "Problem Solving & Data Analysis",
            "Geometry & Trigonometry"
        ]
    };

    useEffect(() => {
        const fetchUploads = async () => {
            const snapshot = await getDocs(
                collection(db, "notes")
            );

            const notes = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(
                    note =>
                        note.uploadedBy === currentUser?.uid
                );

            setUploads(notes);
        };

        if (currentUser) {
            fetchUploads();
        }
    }, [currentUser]);

    const handleDelete = async (noteId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this resource?"
        );

        if (!confirmed) return;

        try {
            await deleteDoc(doc(db, "notes", noteId));

            setUploads(
                uploads.filter(
                    (note) => note.id !== noteId
                )
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete resource.");
        }
    };

    useEffect(() => {
        const fetchSavedResources = async () => {
            if (!currentUser) return;

            try {
                const savedSnapshot = await getDocs(
                    query(
                        collection(db, "savedResources"),
                        where("userId", "==", currentUser.uid)
                    )
                );

                const savedIds = savedSnapshot.docs.map(
                    doc => doc.data().noteId
                );

                const notesSnapshot = await getDocs(
                    collection(db, "notes")
                );

                const savedNotes = notesSnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .filter(note =>
                        savedIds.includes(note.id)
                    );

                setSavedResources(savedNotes);

            } catch (error) {
                console.error(error);
            }
        };

        fetchSavedResources();
    }, [currentUser]);

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Delete your PASS account? This cannot be undone."
        );

        if (!confirmed) return;

        try {
            await deleteUser(auth.currentUser);

            toast.success("Account deleted.");

            navigate("/");
        } catch (error) {
            console.error(error);

            if (
                error.code ===
                "auth/requires-recent-login"
            ) {
                toast.error(
                    "Please log out and sign in again before deleting your account."
                );
            } else {
                toast.error("Failed to delete account.");
            }
        }
    };

    const startEditing = (note) => {
        setEditingId(note.id);

        setEditTitle(note.title);
        setEditDescription(note.description);
        setEditFileUrl(note.fileUrl);

        setEditSubject(note.subject);
        setEditSubtopic(note.subtopic);
        setEditLevel(note.level);

        setShowEditModal(true);
    };

    const saveChanges = async () => {
        try {
            await updateDoc(
                doc(db, "notes", editingId),
                {
                    title: editTitle,
                    description: editDescription,
                    fileUrl: editFileUrl,

                    subject: editSubject,
                    subtopic: editSubtopic,
                    level: editLevel,
                }
            );

            setUploads(
                uploads.map((note) =>
                    note.id === editingId
                        ? {
                            ...note,
                            title: editTitle,
                            description: editDescription,
                            fileUrl: editFileUrl,

                            subject: editSubject,
                            subtopic: editSubtopic,
                            level: editLevel,
                        }
                        : note
                )
            );

            toast.success("Resource updated!");

            setEditingId(null);
            setShowEditModal(false);

        } catch (error) {
            console.error(error);
            toast.error("Failed to update resource.");
        }
    };

    return (
        <Layout>
            <section className="profile-page">
                <div className="container">

                    <div className="profile-card">

                        {currentUser?.photoURL ? (
                            <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                className="profile-avatar"
                            />
                        ) : (
                            <div className="profile-avatar-fallback">
                                {currentUser?.displayName?.charAt(0) || "P"}
                            </div>
                        )}

                        <h1>{currentUser?.displayName}</h1>

                        <p className="profile-email">
                            {currentUser?.email}
                        </p>

                        <div className="profile-stats">
                            <div>
                                <strong>{uploads.length}</strong>
                                <span>Uploads</span>
                            </div>

                            <div>
                                <strong>{savedResources.length}</strong>
                                <span>Saved</span>
                            </div>
                        </div>

                    </div>

                    <h3 className="uploads-heading">
                        My Uploads
                    </h3>

                    <div className="uploads-grid">
                        {uploads.map((note) => (
                            <div
                                key={note.id}
                                className="upload-card"
                            >
                                <>
                                    <h4>{note.title}</h4>

                                    <p className="description">
                                        {note.description}
                                    </p>
                                </>

                                <div className="resource-tags">
                                    <span>{note.subject}</span>

                                    <span>{note.subtopic}</span>

                                    <span>{note.level}</span>
                                </div>

                                <p className="resource-domain">
                                    🌐 {
                                        new URL(note.fileUrl).hostname
                                            .replace("www.", "")
                                    }
                                </p>


                                <a
                                    href={note.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="open-btn"
                                >
                                    Open Resource
                                </a>

                                <div className="resource-actions">

                                    <button
                                        className="edit-btn"
                                        onClick={() => startEditing(note)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(note.id)}
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="danger-btn"
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </button>
                </div>
            </section>

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <h2>Edit Resource</h2>

                        <input
                            value={editTitle}
                            onChange={(e) =>
                                setEditTitle(e.target.value)
                            }
                            placeholder="Title"
                        />

                        <select
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                        >
                            <option>Mathematics</option>
                            <option>Science</option>
                            <option>English</option>
                            <option>History</option>
                            <option>Economics</option>
                            <option>Computer Science</option>
                            <option>SAT</option>
                        </select>

                        <select
                            value={editSubtopic}
                            onChange={(e) => setEditSubtopic(e.target.value)}
                        >
                            {subtopics[editSubject]?.map((topic) => (
                                <option key={topic}>
                                    {topic}
                                </option>
                            ))}
                        </select>

                        <select
                            value={editLevel}
                            onChange={(e) => setEditLevel(e.target.value)}
                        >
                            <option>CP</option>
                            <option>Honors</option>
                            <option>AP</option>
                            <option>College</option>
                            <option>SAT</option>
                        </select>

                        <textarea
                            value={editDescription}
                            onChange={(e) =>
                                setEditDescription(e.target.value)
                            }
                            placeholder="Description"
                        />

                        <input
                            value={editFileUrl}
                            onChange={(e) =>
                                setEditFileUrl(e.target.value)
                            }
                            placeholder="Resource URL"
                        />

                        <div className="modal-actions">
                            <button
                                className="save-btn"
                                onClick={saveChanges}
                            >
                                Save Changes
                            </button>

                            <button
                                className="cancel-btn"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingId(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}