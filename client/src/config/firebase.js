import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:demo",
};

// Check if Firebase is properly configured
const isFirebaseConfigured = process.env.REACT_APP_FIREBASE_API_KEY && 
  process.env.REACT_APP_FIREBASE_PROJECT_ID &&
  process.env.REACT_APP_FIREBASE_API_KEY !== "demo-api-key" &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID !== "demo-project";

// Initialize Firebase only if properly configured
let app = null;
let auth = null;
let db = null;
let githubProvider = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // GitHub Auth Provider
    githubProvider = new GithubAuthProvider();
    githubProvider.addScope("repo");
    githubProvider.addScope("user:email");
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else {
  console.log("🔥 Firebase not configured - running in demo mode");
}

// Export Firebase services (null if not configured)
export { auth, db, githubProvider };
export default app;
