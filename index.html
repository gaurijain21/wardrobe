// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, query, where, orderBy, limit,
  getDocs, serverTimestamp, doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configure auth settings
auth.useDeviceLanguage();

// Auth functions
export function onUser(callback) {
  return onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user ? `${user.email} (${user.uid})` : "null");
    callback(user);
  });
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  // Add scopes for better user info
  provider.addScope('profile');
  provider.addScope('email');
  
  // Set custom parameters
  provider.setCustomParameters({
    prompt: 'select_account' // Always show account selection
  });
  
  try {
    console.log("Initiating Google sign-in redirect...");
    await signInWithRedirect(auth, provider);
    // The page will redirect to Google, so code after this won't execute
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    console.log("Signing out user...");
    await signOut(auth);
    console.log("✅ Sign out successful");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

// Create outfit function
export async function createOutfit({ userId, file, category, notes, colors }) {
  try {
    console.log("Creating outfit for user:", userId);
    
    // 1. Upload image to Storage
    const timestamp = Date.now();
    const filename = `outfits/${userId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, filename);
    
    console.log("Uploading image to:", filename);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    console.log("Image uploaded, URL:", imageUrl);
    
    // 2. Save outfit data to Firestore
    const outfitData = {
      userId,
      category,
      notes: notes || "",
      colors: colors || [],
      imageUrl,
      createdAt: serverTimestamp()
    };
    
    console.log("Saving outfit data to Firestore...");
    const docRef = await addDoc(collection(db, "outfits"), outfitData);
    console.log("✅ Outfit created with ID:", docRef.id);
    
    return { id: docRef.id, ...outfitData };
  } catch (error) {
    console.error("Error creating outfit:", error);
    throw error;
  }
}

// Get outfits by category
export async function getOutfitsByCategory(userId, category) {
  try {
    console.log(`Getting ${category} outfits for user:`, userId);
    
    const q = query(
      collection(db, "outfits"),
      where("userId", "==", userId),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    const outfits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${outfits.length} ${category} outfits`);
    
    return outfits;
  } catch (error) {
    console.error("Error getting outfits:", error);
    throw error;
  }
}

// Get recent outfits
export async function getRecentOutfits(userId, limitCount = 8) {
  try {
    console.log(`Getting ${limitCount} recent outfits for user:`, userId);
    
    const q = query(
      collection(db, "outfits"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const outfits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${outfits.length} recent outfits`);
    
    return outfits;
  } catch (error) {
    console.error("Error getting recent outfits:", error);
    throw error;
  }
}

export { auth, db, storage };