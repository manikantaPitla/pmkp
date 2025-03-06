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
        try {
          if (user) {
            navigate(`/profile/${user.uid}`);
          }
        } catch (error) {
          stopLoading();
          console.error("Auth state error:", error);
          setError("Failed to authenticate. Please try again.");
        } finally {
        }
      },
      (err) => {
        stopLoading();
        console.error("Auth state error:", err);
        setError("Failed to authenticate. Please try again.");
      }
    );

    return () => unsubscribe();
  }, [navigate, stopLoading]);

  if (loading) return <FullPageLoader />;
  if (error)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p className="error-message">{error}</p>
      </div>
    );

  return children;
}

export default AuthRedirect;
