import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/dbConfig";

export const getDocData = async (id, message) => {
  const docRef = doc(db, "users", id);

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const docData = docSnap.data();
    console.log(docData);
    const messageDocRef = doc(db, "messages", docData?.id);

    await updateDoc(messageDocRef, {
      messageList: arrayUnion({ id: Date.now(), message }),
    });

    return docData;
  } else {
    throw new Error("ID not found, enter valid ID");
  }
};
