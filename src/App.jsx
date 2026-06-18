import { HashRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/Home";
import Notes from "./pages/Notes/Notes";
import SATPrep from "./pages/SATPrep";
import Community from "./pages/Community/Community";
import Dashboard from "./pages/Dashboard/Dashboard";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Profile from "./Profile/Profile";
import Upload from "./pages//Upload/Upload";
import Feedback from "./pages/Feedback/Feedback";

function App() {
  return (
    <HashRouter>
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
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </HashRouter>
  );
}

export default App;