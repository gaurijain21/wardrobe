
import { getAnalytics } from "firebase/analytics";

// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, query, where, orderBy, limit,
  getDocs, serverTimestamp, doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuIUjnescqb-Ta0t1qHMMlyjAdHF_GTdI",
  authDomain: "wardrobe-cd609.firebaseapp.com",
  projectId: "wardrobe-cd609",
  storageBucket: "wardrobe-cd609.firebasestorage.app",
  messagingSenderId: "864099900869",
  appId: "1:864099900869:web:2fbc97380b8f041ac7ffac",
  measurementId: "G-NN603WJVY4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);