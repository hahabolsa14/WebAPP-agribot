// firebase.web.ts - Web-specific Firebase configuration
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Web config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCSu-jK1K_ifl-zDghThuoBU8L4Fx9U9Zo",
  authDomain: "ecoventure-f7c63.firebaseapp.com",
  projectId: "ecoventure-f7c63",
  storageBucket: "ecoventure-f7c63.appspot.com",
  messagingSenderId: "442931597967",
  appId: "1:442931597967:web:43e047e4d54fd705f5d6fa",
  measurementId: "G-5XFVFRCB5K",
};

// avoid duplicate app initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initialize Auth for web with browser persistence
const auth = getAuth(app);

// Set browser local persistence for web
setPersistence(auth, browserLocalPersistence);

export { app, auth };
export const db = getFirestore(app);