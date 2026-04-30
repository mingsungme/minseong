import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKG5L2OlkrKXtHbfaC722JNflXBnhdL8w",
  authDomain: "portfolio-kms.firebaseapp.com",
  databaseURL: "https://portfolio-kms-default-rtdb.firebaseio.com",
  projectId: "portfolio-kms",
  storageBucket: "portfolio-kms.firebasestorage.app",
  messagingSenderId: "879219874388",
  appId: "1:879219874388:web:f327934382c902b8e26bc1",
  measurementId: "G-7Q52Y877JR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
