import Layout from "../components/Layout/Layout";
import "./Profile.css";
import { useAuth } from "../context/AuthContext";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
    collection,
    getDocs
} from "firebase/firestore";

export default function Profile() {
    const { currentUser } = useAuth();
    const [uploads, setUploads] = useState([]);

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

    return (
        <Layout>
            <section className="profile-page">
                <div className="container">

                    <div className="profile-card">
                        <h1>My Profile</h1>

                        <h2>{currentUser?.displayName}</h2>

                        <p className="profile-email">
                            {currentUser?.email}
                        </p>

                        <p className="upload-count">
                            {uploads.length} Resources Uploaded
                        </p>
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

                                <a
                                    href={note.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="resource-link"
                                >
                                    Open Resource →
                                </a>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </Layout>
    );
}