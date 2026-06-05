import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Notes from "./pages/Notes/Notes";
import SATPrep from "./pages/SATPrep";
import Community from "./pages/Community/Community";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Profile from "./Profile/Profile";
import Upload from "./pages//Upload/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/notes" element={<Notes />} />

        <Route path="/sat-prep" element={<SATPrep />} />

        <Route
          path="/community"
          element={<Community />}
        />

        <Route
          path="/profile"
          element={<Profile />} />
        <Route
          path="/upload"
          element={<Upload />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;