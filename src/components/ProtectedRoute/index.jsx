import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLoading from "../../hooks/useLoading";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/dbConfig";
import { getUserProfileData } from "../../services/firebaseFunctions";
import useAuthActions from "../../hooks/useAuthActions";

import { SquareLoader } from "../../utils/loader";

const ProtectedRoute = ({ children }) => {
  const { loading, startLoading, stopLoading } = useLoading(true);

  const navigate = useNavigate();
  const { setUser, removeUser } = useAuthActions();

  useEffect(() => {
    startLoading();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userData = await getUserProfileData(user?.uid);
          setUser({
            ...userData,
            email: user.email,
            id: user.uid,
            metaData: JSON.stringify(user.metadata),
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

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SquareLoader />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
