import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "../firebase";
import { doc, getDoc, updateDoc, serverTimestamp, onSnapshot } from "../firebase";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Verify user exists in Firestore
    const userDoc = await getUserProfileData(userCredential.user.uid);
    if (!userDoc) {
      // If user doesn't exist in Firestore, sign them out
      await signOut(auth);
      throw new Error("User profile not found. Please contact administrator.");
    }

    // Update last login timestamp
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
  } catch (error) {
    throw new Error("Error updating last login");
  }
};
