import { useState } from "react";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function UploadNotes() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Math");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Add a title and file first.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create storage path
      const fileRef = ref(
        storage,
        `notes/${user.uid}/${Date.now()}_${file.name}`
      );

      // 2. Upload file
      await uploadBytes(fileRef, file);

      // 3. Get URL
      const fileUrl = await getDownloadURL(fileRef);

      // 4. Save metadata to Firestore
      await addDoc(collection(db, "notes"), {
        title,
        subject,
        fileUrl,
        fileName: file.name,
        uploadedBy: user.uid,
        createdAt: serverTimestamp(),
      });

      alert("Upload successful!");

      // reset
      setTitle("");
      setFile(null);
      setSubject("Math");

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

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}