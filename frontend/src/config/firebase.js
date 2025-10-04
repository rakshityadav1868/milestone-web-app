import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChEmBW6AjTvsOyxcxoOqFR7kJJ8riTLjE",
  authDomain: "celebratehub-mvp.firebaseapp.com",
  projectId: "celebratehub-mvp",
  storageBucket: "celebratehub-mvp.firebasestorage.app",
  messagingSenderId: "498272678117",
  appId: "1:498272678117:web:664adc871eddef5036640c",
  measurementId: "G-HF9VFD4F1C"
};

// Initialize Firebase
let app = null;
let auth = null;
let db = null;
let githubProvider = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // GitHub Auth Provider
  githubProvider = new GithubAuthProvider();
  githubProvider.addScope("repo");
  githubProvider.addScope("user:email");
  
  console.log("🔥 Firebase initialized successfully");
} catch (error) {
  console.warn("Firebase initialization failed:", error);
}

// Export Firebase services (null if not configured)
export { auth, db, githubProvider };
export default app;
