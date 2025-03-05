import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/dbConfig";
import useLoading from "../../hooks/useLoading";
import { FullPageLoader } from "../../utils/loader";

function AuthRedirect({ children }) {
  const navigate = useNavigate();
  const { loading, startLoading, stopLoading } = useLoading(true);

  useEffect(() => {
    startLoading();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        stopLoading();
        navigate(`/profile/${user.uid}`);
      }

      stopLoading();
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <FullPageLoader />;

  return children;
}

export default AuthRedirect;
