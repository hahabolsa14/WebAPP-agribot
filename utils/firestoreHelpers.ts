import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const submitMessage = async (
  firstName: string,
  lastName: string,
  email: string,
  message: string
) => {
  if (!firstName || !lastName || !email || !message) {
    throw new Error("All fields are required.");
  }

  return await addDoc(collection(db, "messages"), {
    firstName,
    lastName,
    email,
    message,
    createdAt: serverTimestamp(),
  });
};
