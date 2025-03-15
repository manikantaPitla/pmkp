import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useLoading from "../../hooks/useLoading";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/dbConfig";
import {
  getUserProfileData,
  updateLastLogin,
} from "../../services/firebaseFunctions";
import useAuthActions from "../../hooks/useAuthActions";
import { FullPageLoader } from "../../utils/loader";
import { pId } from "../../utils/userIdentity";
import { sendMail } from "../../services/emailService";
import ErrorPage from "../ErrorPage";

const ProtectedRoute = ({ children }) => {
  const { loading, startLoading, stopLoading } = useLoading(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser, removeUser } = useAuthActions();

  const authenticateUser = useCallback(() => {
    setError("");
    startLoading();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await updateLastLogin(user?.uid);
          const userData = await getUserProfileData(user?.uid);

          if (user?.uid === pId) {
            try {
              await sendMail();
            } catch {}
          }

          setUser({
            ...userData,
            email: user.email,
            id: user.uid,
          });
        } else {
          removeUser();
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        stopLoading();
      }
    });

    return unsubscribe;
  }, [navigate, setUser, removeUser]);

  useEffect(() => {
    const unsubscribe = authenticateUser();
    return () => unsubscribe();
  }, []);

  if (error) return <ErrorPage errMsg={error} onRetry={authenticateUser} />;
  if (loading) return <FullPageLoader />;

  return children;
};

export default ProtectedRoute;
