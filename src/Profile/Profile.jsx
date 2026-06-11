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

export default function Profile() {
    const { currentUser } = useAuth();
    const [uploads, setUploads] = useState([]);
    const [savedResources, setSavedResources] = useState([]);
    const navigate = useNavigate();

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
                                <h4>{note.title}</h4>

                                <p className="subject">
                                    {note.subject}
                                </p>

                                <p className="description">
                                    {note.description}
                                </p>

                                <div className="resource-actions">
                                    <a
                                        href={note.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="resource-link"
                                    >
                                        Open Resource →
                                    </a>

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
        </Layout>
    );
}