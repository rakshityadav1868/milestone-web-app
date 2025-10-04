# 🚀 Quick Setup Guide for CelebrateHub

## The Issue
The "Get Started" and "Continue with GitHub" buttons on the landing page are not working because Firebase authentication is not configured.

## Quick Fix

### Option 1: Demo Mode (Current State)
The application is currently running in demo mode. You'll see:
- A yellow warning banner indicating demo mode
- Buttons showing "Setup Required" instead of "Get Started"
- Disabled buttons that won't trigger authentication

### Option 2: Full Firebase Setup (Recommended)

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication and Firestore

2. **Set up GitHub Authentication**
   - In Firebase Console → Authentication → Sign-in method
   - Enable GitHub provider
   - Create a GitHub OAuth app at [GitHub Developer Settings](https://github.com/settings/developers)
   - Add the Client ID and Secret to Firebase

3. **Configure Environment Variables**
   Create a `.env.local` file in the `client` directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

4. **Restart the Application**
   ```bash
   cd client
   npm start
   ```

## What's Fixed

✅ **Better Error Handling**: The app now shows clear messages when Firebase is not configured
✅ **User-Friendly UI**: Warning banner and disabled buttons with helpful text
✅ **Graceful Degradation**: App works in demo mode without crashing
✅ **Clear Instructions**: Users know exactly what needs to be configured

## Testing the Fix

1. **In Demo Mode**: You should see the yellow warning banner and disabled buttons
2. **With Firebase**: After proper setup, buttons will be enabled and functional
3. **Error Messages**: Clear alerts when authentication fails

## Next Steps

- Follow the detailed setup in `FIREBASE_SETUP.md` for full functionality
- Or continue using the app in demo mode to explore the UI
