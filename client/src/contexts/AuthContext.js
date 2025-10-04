import { GithubAuthProvider } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, githubProvider, db } from "../config/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Check if Firebase is configured
  const isFirebaseConfigured = auth && githubProvider && db;

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured - cannot sign in");
      // Show user-friendly error message
      alert("Firebase authentication is not configured. Please set up your Firebase credentials to use this feature. Check the FIREBASE_SETUP.md file for instructions.");
      throw new Error("Firebase authentication not configured");
    }

    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      // Get GitHub access token
      const credential = GithubAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      // Store user data in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          githubUsername: user.reloadUserInfo?.screenName || user.displayName,
          accessToken: accessToken,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
        { merge: true }
      );

      return user;
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured - cannot sign out");
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    if (!isFirebaseConfigured) {
      return null;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Firebase not configured - set loading to false immediately
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isFirebaseConfigured]);

  const value = {
    user,
    userProfile,
    loading,
    signInWithGitHub,
    logout,
    getUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
