# 🔥 Firebase MVP Setup Guide

This guide will help you set up the complete Firebase MVP version of CelebrateHub with GitHub authentication, real-time milestone tracking, and LinkedIn sharing.

## 🚀 Quick Start

### 1. Firebase Project Setup

1. **Create a Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create a project"
   - Name it `celebratehub-mvp` (or your preferred name)
   - Enable Google Analytics (optional)

2. **Enable Required Services**
   - **Authentication**: Go to Authentication > Sign-in method > GitHub > Enable
   - **Firestore**: Go to Firestore Database > Create database > Start in test mode
   - **Hosting**: Go to Hosting > Get started
   - **Functions**: Go to Functions > Get started

### 2. GitHub OAuth App Setup

1. **Create GitHub OAuth App**

   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Click "New OAuth App"
   - Fill in:
     - **Application name**: CelebrateHub
     - **Homepage URL**: `http://localhost:3000` (for development)
     - **Authorization callback URL**: `https://your-project-id.firebaseapp.com/__/auth/handler`
   - Copy the **Client ID** and **Client Secret**

2. **Configure Firebase Auth**
   - In Firebase Console > Authentication > Sign-in method > GitHub
   - Paste your GitHub Client ID and Client Secret
   - Save the configuration

### 3. Environment Configuration

1. **Get Firebase Config**

   - Go to Project Settings > General > Your apps
   - Click "Add app" > Web app
   - Copy the Firebase config object

2. **Create Environment Files**

   ```bash
   # Copy the example file
   cp env.example .env
   cp env.example client/.env.local
   ```

3. **Update `.env` (Root)**

   ```env
   # Firebase Configuration (Server-side)
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

   # OpenAI Configuration (Optional)
   OPENAI_API_KEY=your-openai-api-key

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Update `client/.env.local`**
   ```env
   # Firebase Configuration (Client-side)
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
   ```

### 4. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install Firebase CLI globally
npm install -g firebase-tools

# Install Cloud Functions dependencies
cd functions && npm install
```

### 5. Firebase CLI Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select the following services:
# - Firestore: Configure security rules and indexes
# - Functions: Configure a Cloud Functions directory
# - Hosting: Configure files for Firebase Hosting

# When prompted:
# - Use existing project: Select your Firebase project
# - Functions: Use TypeScript, ESLint: Yes
# - Hosting: Use client/build as public directory
```

### 6. Deploy Cloud Functions

```bash
# Build and deploy functions
cd functions
npm run build
firebase deploy --only functions
```

### 7. Run the Application

#### Development Mode

```bash
# Start the development server
npm run dev
```

#### Production Mode

```bash
# Build the client
cd client && npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## 🔧 GitHub Webhook Setup

### 1. Configure Webhook in GitHub

1. Go to your repository settings
2. Navigate to "Webhooks" section
3. Click "Add webhook"
4. Set the payload URL to: `https://your-region-your-project-id.cloudfunctions.net/githubWebhook`
5. Select content type: `application/json`
6. Select events: `Pull requests`, `Issues`, `Pushes`, `Stars`
7. Make sure "Active" is checked
8. Click "Add webhook"

### 2. Test Webhook

Create a test PR or star your repository to trigger the webhook and see milestones appear in your dashboard.

## 🎯 Features Overview

### ✅ Implemented Features

1. **Modern Landing Page**

   - Animated background with floating GitHub icons
   - Gradient design inspired by GitHub
   - Smooth animations with Framer Motion
   - GitHub OAuth login button

2. **Firebase Authentication**

   - GitHub OAuth integration
   - User profile management
   - Secure authentication flow

3. **Personalized Dashboard**

   - Real-time milestone updates
   - User profile display
   - Achievement statistics
   - Confetti animations for new milestones

4. **Milestone Tracking**

   - Pull request milestones (1, 5, 10, 25, 50, 100)
   - Star milestones (1, 10, 25, 50, 100, 500, 1000)
   - Issue milestones (1, 5, 10, 25, 50)
   - Commit milestones (10, 50, 100, 500, 1000)
   - Contribution day streaks (7, 30, 90, 180, 365)

5. **LinkedIn Sharing**

   - Generate celebratory posts
   - Direct sharing to LinkedIn
   - Customized messages for each milestone type

6. **Real-time Updates**
   - Firestore real-time listeners
   - Automatic milestone detection
   - Live dashboard updates

### 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Theme**: Automatic theme switching
- **3D Interactive Cards**: Smooth hover effects
- **Confetti Animations**: Celebrate new achievements
- **Smooth Transitions**: Framer Motion animations
- **Modern Typography**: Clean, readable fonts

## 📊 Firestore Database Structure

```
users/
  {uid}/
    displayName: string
    email: string
    photoURL: string
    githubUsername: string
    accessToken: string
    createdAt: timestamp
    lastLoginAt: timestamp

events/
  {eventId}/
    type: string (pull_request, star, issue, push)
    action: string (opened, closed, created)
    repository: object {name, full_name, owner}
    sender: object {login, avatar_url}
    timestamp: timestamp
    raw_data: object

milestones/
  {milestoneId}/
    type: string
    count: number
    repository: string
    contributor: string
    userId: string
    date: timestamp
    milestone_reached: number

contributor_stats/
  {repo_contributor}/
    pull_requests: number
    stars: number
    issues: number
    commits: number
    contribution_days: array
    last_updated: timestamp
```

## 🚀 Deployment Options

### Option 1: Firebase Hosting (Recommended)

```bash
# Build and deploy
cd client && npm run build
firebase deploy
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 3: Netlify

```bash
# Build the project
cd client && npm run build

# Deploy to Netlify
# Upload the build folder to Netlify
```

## 🔧 Troubleshooting

### Common Issues

1. **Firebase Auth Not Working**

   - Check GitHub OAuth app configuration
   - Verify callback URLs match
   - Ensure Firebase project has GitHub provider enabled

2. **Webhook Not Receiving Events**

   - Check webhook URL is correct
   - Verify Cloud Functions are deployed
   - Check Firebase Functions logs

3. **Real-time Updates Not Working**

   - Check Firestore security rules
   - Verify user authentication
   - Check browser console for errors

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check environment variables
   - Verify Firebase configuration

### Debug Mode

Enable debug logging:

```bash
# Set environment variable
export NODE_ENV=development

# Check Firebase Functions logs
firebase functions:log
```

## 📱 Mobile Support

The app is fully responsive and works on:

- iOS Safari
- Android Chrome
- Mobile browsers
- PWA capabilities (can be added)

## 🔒 Security Features

- Firebase Authentication with GitHub OAuth
- Firestore security rules
- Webhook signature verification (optional)
- CORS protection
- Rate limiting on API endpoints

## 🎉 Next Steps

1. **Add More Milestone Types**

   - Custom milestone definitions
   - Team-based milestones
   - Repository-specific milestones

2. **Enhanced Sharing**

   - Twitter integration
   - Discord webhooks
   - Email notifications

3. **Analytics**

   - User engagement tracking
   - Milestone achievement analytics
   - Popular repositories tracking

4. **Social Features**
   - Follow other developers
   - Milestone leaderboards
   - Achievement badges

---

**🎯 Your Firebase MVP is now ready!**

Visit your deployed app and start celebrating GitHub milestones! 🚀
