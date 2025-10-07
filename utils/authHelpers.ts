import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import { Alert } from "react-native";
import { auth } from "../firebase";

import { User } from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return { user };
};

// Sign in helper
export const signInUser = async (email: string, password: string) => {
  if (!email || !password) {
    Alert.alert("Login Failed", "Please enter both email and password.");
    return null;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    handleFirebaseError(error, "sign-in");
    return null;
  }
};

// Sign up helper
export const registerUser = async (email: string, password: string) => {
  if (!email || !password) {
    Alert.alert("Registration Failed", "Email and password are required.");
    return null;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    handleFirebaseError(error, "sign-up");
    return null;
  }
};

// Error handler with context
const handleFirebaseError = (error: any, type: "sign-in" | "sign-up") => {
  console.log("Firebase Auth Error:", error);

  if (type === "sign-in") {
    switch (error.code) {
      case "auth/invalid-email":
        Alert.alert("Login Failed", "Invalid Email Format");
        break;
      case "auth/user-not-found":
        Alert.alert("Login Failed", "No account exists with this email. Please register first.");
        break;
      case "auth/wrong-password":
        Alert.alert("Login Failed", "Incorrect password. Please try again.");
        break;
      case "auth/invalid-credential":
        Alert.alert("Login Failed", "Invalid email or password.");
        break;
      default:
        Alert.alert("Login Failed", error.message || "An unexpected error occurred. Please try again.");
    }
  } else if (type === "sign-up") {
    switch (error.code) {
      case "auth/email-already-in-use":
        Alert.alert(
          "Registration Failed",
          "The email you entered is already registered. Please log in or use a different Gmail."
        );
        break;
      case "auth/invalid-email":
        Alert.alert(
          "Registration Failed",
          "The email you entered is not valid. Make sure it follows the format: example@gmail.com."
        );
        break;
      case "auth/weak-password":
        Alert.alert(
          "Registration Failed",
          "Your password is too weak. It must be at least 6 characters long."
        );
        break;
      default:
        Alert.alert(
          "Registration Failed",
          error.message || "An unexpected error occurred. Please try again later."
        );
    }
  }
};
