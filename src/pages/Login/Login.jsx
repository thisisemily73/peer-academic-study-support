import Layout from "../../components/Layout/Layout";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      toast.success(`Welcome ${result.user.displayName}!`);
    } catch (error) {
      console.error(error);
      toast.error("Login failed.");
    }
  };

  return (
    <Layout>
      <h1>Login</h1>

      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </Layout>
  );
}