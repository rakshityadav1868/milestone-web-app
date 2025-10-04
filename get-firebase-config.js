#!/usr/bin/env node

/**
 * Script to help get Firebase client configuration
 * Run this after you've logged into Firebase CLI
 */

const { execSync } = require("child_process");

console.log("🔥 Firebase Configuration Helper");
console.log("================================\n");

console.log("To get your Firebase client configuration:");
console.log("1. Run: firebase login");
console.log("2. Run: firebase use milestonehub-16c64");
console.log("3. Run: firebase apps:sdkconfig web");
console.log("\nThis will give you the client-side Firebase config object.\n");

console.log("Then create client/.env.local with:");
console.log("REACT_APP_FIREBASE_API_KEY=your-api-key");
console.log(
  "REACT_APP_FIREBASE_AUTH_DOMAIN=milestonehub-16c64.firebaseapp.com"
);
console.log("REACT_APP_FIREBASE_PROJECT_ID=milestonehub-16c64");
console.log("REACT_APP_FIREBASE_STORAGE_BUCKET=milestonehub-16c64.appspot.com");
console.log("REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id");
console.log("REACT_APP_FIREBASE_APP_ID=your-app-id\n");

console.log("Alternative: Get config from Firebase Console:");
console.log("1. Go to https://console.firebase.google.com");
console.log("2. Select project: milestonehub-16c64");
console.log("3. Go to Project Settings > General");
console.log('4. Scroll to "Your apps" section');
console.log("5. Add web app or copy existing config\n");

try {
  // Try to get current Firebase project
  const project = execSync("firebase use", { encoding: "utf8" });
  console.log("Current Firebase project:", project.trim());
} catch (error) {
  console.log("❌ Not logged into Firebase CLI yet.");
  console.log("Run: firebase login");
}
