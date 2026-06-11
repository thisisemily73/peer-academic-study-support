import Layout from "../../components/Layout/Layout";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState, useRef } from "react";

import "./Login.css";

import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function Login() {
  const location = useLocation();

  const toastShown = useRef(false);

  useEffect(() => {
    if (
      location.state?.message &&
      !toastShown.current
    ) {
      toast.error(location.state.message);
      toastShown.current = true;
    }
  }, [location]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      toast.success(`Welcome, ${result.user.displayName}!`);

      // navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Login failed.");
    }
  };

  return (
    <Layout>
      <section className="auth-page">
        <div className="auth-card">
          <h1>Welcome Back</h1>

          <p className="auth-subtitle">
            Sign in to access your resources,
            saved notes, and study tools.
          </p>

          <form className="auth-form">
            <input
              type="email"
              placeholder="Email"
            />

            <input
              type="password"
              placeholder="Password"
            />

            <button
              type="button"
              className="auth-primary-btn"
            >
              Sign In
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="google-btn"
          >
            Continue with Google
          </button>

          <p className="auth-footer">
            Don't have an account?
            {" "}
            <a href="/signup">Create one</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}