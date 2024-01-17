// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {collection, getFirestore} from 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC4Cyn-1II61FiM-drbQq5beTwwk1afOUY",
  authDomain: "moviestar-d20cc.firebaseapp.com",
  projectId: "moviestar-d20cc",
  storageBucket: "moviestar-d20cc.appspot.com",
  messagingSenderId: "406961791538",
  appId: "1:406961791538:web:e53a39c0a37653735d922b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const dp=getFirestore(app);
export const moviesRef=collection(dp,"movies");
export const reviewsRef=collection(dp,"reviews");
export const usersRef=collection(dp,"users");

export default app;

