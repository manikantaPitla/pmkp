import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading, useAuthActions } from "../../hooks";
import { onAuthStateChanged, auth } from "../../services/firebase";
import { getUserProfileData, sendMail, setUserOnline, setUserOffline, setPresenceHeartbeat } from "../../services";
import { pId } from "../../utils";

const ProtectedRoute = ({ children }) => {
  const { loading, startLoading, stopLoading } = useLoading(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser, removeUser } = useAuthActions();

  const authenticateUser = useCallback(() => {
    setError("");
    startLoading();

    const unsubscribe = onAuthStateChanged(auth, async user => {
      try {
        if (user) {
          const userData = await getUserProfileData(user?.uid);

          if (user?.uid === pId) {
            try {
              await sendMail();
            } catch {}
          }

          setUser({
            ...userData,

            lastLogin: userData?.lastLogin?.toMillis ? userData.lastLogin.toMillis() : (userData?.lastLogin ?? null),
            lastSeen: userData?.lastSeen?.toMillis ? userData.lastSeen.toMillis() : (userData?.lastSeen ?? null),
            heartbeatAt: userData?.heartbeatAt?.toMillis ? userData.heartbeatAt.toMillis() : (userData?.heartbeatAt ?? null),
            email: user.email,
            id: user.uid,
          });
          try {
            await setUserOnline(user.uid);
          } catch {}
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
    const beforeUnload = async () => {
      try {
        const user = auth.currentUser;
        if (user) await setUserOffline(user.uid);
      } catch {}
    };
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("visibilitychange", async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        if (document.visibilityState === "visible") await setUserOnline(user.uid);
        else await setUserOffline(user.uid);
      } catch {}
    });
    // lightweight heartbeat every 25s while tab is visible
    const interval = setInterval(async () => {
      try {
        if (document.visibilityState !== "visible") return;
        const user = auth.currentUser;
        if (user) await setPresenceHeartbeat(user.uid);
      } catch {}
    }, 25000);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      // best-effort set offline
      beforeUnload();
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  if (error) return <ErrorPage errMsg={error} onRetry={authenticateUser} />;
  if (loading) return <FullPageLoader />;

  return children;
};

export default ProtectedRoute;
