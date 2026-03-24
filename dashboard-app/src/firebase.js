import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoqOuUWQFQEt76hXc-ME4_rotYsaN2GS8",
  authDomain: "dashboard-app-6c28e.firebaseapp.com",
  projectId: "dashboard-app-6c28e",
  storageBucket: "dashboard-app-6c28e.firebasestorage.app",
  messagingSenderId: "244458687347",
  appId: "1:244458687347:web:b63c972e1235231f031306",
  measurementId: "G-6GV6F7P9ZS"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);