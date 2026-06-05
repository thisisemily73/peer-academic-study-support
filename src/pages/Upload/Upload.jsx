import { useState } from "react";
// import { auth, db, storage } from "../../firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function UploadNotes() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Math");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);


  const handleUpload = async () => {
    if (!title || !fileUrl) {
      alert("Please enter a title and resource link.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "notes"), {
        title,
        subject,
        description,
        fileUrl,
        uploadedBy: user.uid,
        createdAt: serverTimestamp(),
      });

      alert("Resource uploaded!");

      setTitle("");
      setSubject("Math");
      setDescription("");
      setFileUrl("");

    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Notes</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option>Math</option>
        <option>Science</option>
        <option>English</option>
        <option>History</option>
      </select>

      <br /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <input
        type="url"
        placeholder="Google Drive / OneDrive / Dropbox link"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}