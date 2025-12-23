// Firebase v9+ modular SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2pbVut7CJF1Q_QKJp_5lulGYAGOgBSW0",
  authDomain: "financeflow-66d79.firebaseapp.com",
  projectId: "financeflow-66d79",
  storageBucket: "financeflow-66d79.appspot.com",
  messagingSenderId: "313168424020",
  appId: "1:313168424020:web:4fc99ae2f342fc74e511c1",
  measurementId: "G-SQB5GFF6L1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
