
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration from the prompt
const firebaseConfig = {
  apiKey: "AIzaSyACWOsum4PNH6U3UPZF8D7BOU85IH9yLfw",
  authDomain: "konkred-142c2.firebaseapp.com",
  projectId: "konkred-142c2",
  storageBucket: "konkred-142c2.appspot.com",
  messagingSenderId: "695406358364",
  appId: "1:695406358364:web:140241a2f3be8cf4f79b99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
