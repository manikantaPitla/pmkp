import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/dbConfig";
import useLoading from "../../hooks/useLoading";
import { FullPageLoader } from "../../utils/loader";

function AuthRedirect({ children }) {
  const navigate = useNavigate();
  const { loading, stopLoading } = useLoading(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          navigate(`/profile/${user.uid}`);
        } else {
          stopLoading();
        }
      },
      (err) => {
        console.error("Auth state error:", err);
        setError("Authentication error. Please refresh and try again.");
        stopLoading();
      }
    );

    return () => unsubscribe();
  }, [navigate, stopLoading]);

  if (loading) return <FullPageLoader />;

  if (error)
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );

  return children;
}

export default AuthRedirect;
