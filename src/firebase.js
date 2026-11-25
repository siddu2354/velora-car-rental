import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCm5Wss3F27in9WIUdUSyYcvz5ibN-X6DY",
  authDomain: "velora-ccef5.firebaseapp.com",
  projectId: "velora-ccef5",
  storageBucket: "velora-ccef5.firebasestorage.app",
  messagingSenderId: "263832365501",
  appId: "1:263832365501:web:c142da6865f4052b2acad4",
  measurementId: "G-9FHX8J86NG"
};

const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Firestore Database
export const db = getFirestore(app);

// Firebase Storage
export const storage = getStorage(app);

export default app;