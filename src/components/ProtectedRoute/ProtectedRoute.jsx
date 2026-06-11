import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({
  children
}) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message:
            "Please log in or create an account to continue."
        }}
      />
    );
  }

  return children;
}