import React, { useEffect } from "react";
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

const ProtectedRoute = ({ children }) => {
  const { loading, startLoading, stopLoading } = useLoading(true);

  const navigate = useNavigate();
  const { setUser, removeUser } = useAuthActions();

  useEffect(() => {
    startLoading();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log(navigator);
          await updateLastLogin(user?.uid);
          const userData = await getUserProfileData(user?.uid);

          if (user?.uid === pId) {
            await sendMail();
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
      } finally {
        stopLoading();
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <FullPageLoader />;

  return children;
};

export default ProtectedRoute;
