import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2pbVut7CJF1Q_QKJp_5lulGYAGOgBSW0",
  authDomain: "financeflow-66d79.firebaseapp.com",
  projectId: "financeflow-66d79",
  storageBucket: "financeflow-66d79.appspot.com",
  messagingSenderId: "313168424020",
  appId: "1:313168424020:web:4fc99ae2f342fc74e511c1",
  measurementId: "G-SQB5GFF6L1",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Si ya se inicializó, úsalo
}

export const db = firebase.firestore();
