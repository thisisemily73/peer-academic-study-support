import Layout from "../../components/Layout/Layout";
import "../Login/Login.css";

import { useState } from "react";
import { auth } from "../../firebase";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please complete all fields.");
      return;
    }

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await updateProfile(
        userCredential.user,
        {
          displayName: name
        }
      );

      toast.success("Account created!");

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      toast.success("Welcome to PASS!");

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Signup failed.");
    }
  };

  return (
    <Layout>
      <section className="auth-page">
        <div className="auth-card">
          <h1>Create Account</h1>

          <p className="auth-subtitle">
            Join PASS and start sharing,
            saving, and discovering study resources.
          </p>

          <div className="auth-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              className="auth-primary-btn"
              onClick={handleSignup}
            >
              Create Account
            </button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            className="google-btn"
            onClick={handleGoogleSignup}
          >
            Continue with Google
          </button>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}