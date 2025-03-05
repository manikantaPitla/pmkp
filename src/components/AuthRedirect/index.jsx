import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/dbConfig";

function AuthRedirect({ children }) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate(`/profile/${user.uid}`);
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isChecking) return null;

  return children;
}

export default AuthRedirect;
