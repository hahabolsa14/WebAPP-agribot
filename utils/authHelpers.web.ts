import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase.web';
import { useState, useEffect } from 'react';

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

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    handleFirebaseError(error, 'sign-in');
    return null;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    handleFirebaseError(error, 'sign-up');
    return null;
  }
};

export const signInUser = async (email: string, password: string) => {
  if (!email || !password) {
    window.alert("Please enter both email and password.");
    return null;
  }
  return await signIn(email, password);
};

// Error handler with context
const handleFirebaseError = (error: any, type: 'sign-in' | 'sign-up') => {
  console.log('Firebase Auth Error:', error);

  if (type === 'sign-in') {
    switch (error.code) {
      case 'auth/invalid-email':
        window.alert('Login Failed: Invalid Email Format');
        break;
      case 'auth/user-not-found':
        window.alert('Login Failed: No account exists with this email. Please register first.');
        break;
      case 'auth/wrong-password':
        window.alert('Login Failed: Incorrect password. Please try again.');
        break;
      case 'auth/invalid-credential':
        window.alert('Login Failed: Invalid email or password.');
        break;
      default:
        window.alert('Login Failed: ' + (error.message || 'An unexpected error occurred. Please try again.'));
    }
  } else if (type === 'sign-up') {
    switch (error.code) {
      case 'auth/email-already-in-use':
        window.alert('Registration Failed: The email you entered is already registered. Please log in or use a different email.');
        break;
      case 'auth/invalid-email':
        window.alert('Registration Failed: The email you entered is not valid. Make sure it follows the format: example@gmail.com.');
        break;
      case 'auth/weak-password':
        window.alert('Registration Failed: Your password is too weak. It must be at least 6 characters long.');
        break;
      default:
        window.alert('Registration Failed: ' + (error.message || 'An unexpected error occurred. Please try again later.'));
    }
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

// Password reset helper
export const resetPassword = async (email: string) => {
  if (!email) {
    window.alert("Error: Please enter your email address.");
    return false;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    window.alert("Success: Password reset email sent! Check your inbox.");
    return true;
  } catch (error: any) {
    console.log("Password reset error:", error);
    
    switch (error.code) {
      case "auth/invalid-email":
        window.alert("Error: Invalid email format.");
        break;
      case "auth/user-not-found":
        window.alert("Error: No account exists with this email.");
        break;
      default:
        window.alert("Error: " + (error.message || "Failed to send reset email. Please try again."));
    }
    return false;
  }
};