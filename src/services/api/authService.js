import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "../firebase";
import { doc, getDoc, updateDoc, serverTimestamp, onSnapshot } from "../firebase";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const userDoc = await getUserProfileData(userCredential.user.uid);
    if (!userDoc) {
      await signOut(auth);
      throw new Error("User profile not found.");
    }

    await updateLastLogin(userCredential.user.uid);

    return userCredential;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logOut = async () => {
  await signOut(auth);
};

export const getUserProfileData = async userId => {
  if (!userId) return;
  const docSnap = await getDoc(doc(db, "users", userId));
  if (docSnap.exists()) return docSnap.data();
  throw new Error("Error finding user");
};

export const getUserProfileSnapShotData = (userId, callback) => {
  if (!userId || typeof callback !== "function") return;
  const userRef = doc(db, "users", userId);
  const unsubscribe = onSnapshot(
    userRef,
    docSnap => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        console.warn("User not found");
        callback(null);
      }
    },
    error => {
      console.error("Error listening to user data:", error);
    }
  );
  return unsubscribe;
};

export const updateLastLogin = async userId => {
  if (!userId) return;
  try {
    await updateDoc(doc(db, "users", userId), { lastLogin: serverTimestamp() });
  } catch {
    throw new Error("Error updating last login");
  }
};

// Presence / Last Seen
export const setUserOnline = async userId => {
  if (!userId) return;
  try {
    await updateDoc(doc(db, "users", userId), { online: true });
  } catch (error) {
    console.error("Error setting user online", error);
  }
};

export const setUserOffline = async userId => {
  if (!userId) return;
  try {
    await updateDoc(doc(db, "users", userId), { online: false, lastSeen: serverTimestamp() });
  } catch (error) {
    console.error("Error setting user offline", error);
  }
};

// Heartbeat to keep presence fresh
export const setPresenceHeartbeat = async userId => {
  if (!userId) return;
  try {
    await updateDoc(doc(db, "users", userId), { online: true, heartbeatAt: serverTimestamp() });
  } catch {}
};
