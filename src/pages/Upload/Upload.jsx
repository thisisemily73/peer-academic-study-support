import { useEffect, useState } from "react";
// import { auth, db, storage } from "../../firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { auth, db } from "../../firebase";
import { toast } from "react-toastify";

import Layout from "../../components/Layout/Layout";

import "./Upload.css";
import { Link } from "react-router-dom";

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

export default function UploadNotes() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [description, setDescription] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [level, setLevel] = useState("CP");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const navigate = useNavigate();


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

    'Computer Science': [
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

  const handleUpload = async () => {
    if (
      !title ||
      !description ||
      !subject ||
      !subtopic ||
      !level ||
      !fileUrl
    ) {
      toast.error(
        "Please complete all fields."
      );

      return;
    }

    if (!fileUrl.startsWith("http://") &&
      !fileUrl.startsWith("https://")) {

      toast.error(
        "Please enter a valid URL."
      );

      return;
    }

    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      setLoading(true);

      const notesRef = collection(db, "notes");

      const duplicateQuery = query(
        notesRef,
        where("fileUrl", "==", fileUrl)
      );

      const duplicateSnapshot = await getDocs(duplicateQuery);

      if (!duplicateSnapshot.empty) {
        const existingNote = duplicateSnapshot.docs[0];

        const openNote = window.confirm(
          "This note already exists. Would you like to open it?"
        );

        if (openNote) {
          window.open(
            existingNote.data().fileUrl,
            "_blank"
          );
        }

        return;
      }

      await addDoc(collection(db, "notes"), {
        title,
        description,

        subject,
        subtopic,
        level,

        fileUrl,
        uploadedBy: user.uid,

        createdAt: serverTimestamp(),
      });

      setShowSuccessModal(true);

      setTitle("");
      setSubject("");
      setSubtopic("");
      setLevel("CP");
      setDescription("");
      setFileUrl("");

    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="upload-page">
        <div className="upload-form">
          <h2>📤 Share a Resource</h2>

          <p className="upload-subtitle">
            Help students succeed by sharing notes,
            study guides, formula sheets, and other
            academic resources.
          </p>

          <div className="form-group">
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setSubtopic("");
              }}
            >
              <option value="">Select Subject</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>History</option>
              <option>Economics</option>
              <option>Computer Science</option>
              <option>SAT</option>
            </select>
          </div>

          <div className="form-group">
            <select
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
            >
              <option value="">Select Subtopic</option>

              {subtopics[subject]?.map((topic) => (
                <option key={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option>CP</option>
              <option>Honors</option>
              <option>AP</option>
              <option>College</option>
              <option>SAT</option>
            </select>
          </div>

          <div className="form-group">
            <textarea
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="url"
              placeholder="Google Drive / OneDrive / Dropbox link"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
          </div>

          <button className="upload-btn" onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {showSuccessModal && (

        <div className="modal-overlay">

          <div className="success-modal">

            <div className="success-icon">

              🎉

            </div>

            <h2>

              Resource Uploaded!

            </h2>

            <p>

              Your study resource is now live on PASS.

              What would you like to do next?

            </p>

            <div className="success-actions">

              <button

                className="primary-btn"

                onClick={() => {

                  setShowSuccessModal(false);

                  window.location.reload();

                }}

              >

                Upload Another

              </button>

              <button

                className="secondary-btn"

                onClick={() =>

                  navigate("/profile")

                }

              >

                My Profile

              </button>

              <button

                className="secondary-btn"

                onClick={() =>

                  navigate("/notes")

                }

              >

                Browse Resources

              </button>

            </div>

          </div>

        </div>

      )}
    </Layout>
  );
}