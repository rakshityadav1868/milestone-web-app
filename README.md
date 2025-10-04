# 🎉 CelebrateHub

A modern web application that celebrates GitHub milestones with AI-powered posts and real-time tracking.

![CelebrateHub](https://img.shields.io/badge/React-18.2.0-blue) ![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange) ![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## ✨ Features

- 🔐 **GitHub Authentication** - Secure login with GitHub OAuth
- 📊 **Real-time Milestone Tracking** - Track PRs, stars, issues, and commits
- 🎨 **Beautiful UI** - Modern, responsive design with dark/light themes
- 🤖 **AI-Powered Posts** - Generate celebratory posts for milestones
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Real-time Updates** - Live dashboard with Firestore integration

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** 8+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd milestones
```

### 2. One-Command Setup

```bash
npm run setup
```

**That's it!** The setup script will automatically:

- ✅ Check your system requirements
- ✅ Install all dependencies (root, client, server, functions)
- ✅ Verify everything is working
- ✅ Show you how to start the app

### 3. Start the Application

After setup completes, choose your preferred mode:

```bash
# Demo mode (recommended for first run - no API keys needed)
npm run dev-demo

# OR Full mode (requires Firebase and OpenAI configuration)
npm run dev
```

The app will be available at:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001

### 3. Configure Firebase

1. **Create Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project named `celebratehub-mvp`

2. **Enable Services**

   - **Authentication** → Sign-in method → Enable GitHub
   - **Firestore Database** → Create database in test mode

3. **Get Firebase Config**

   - Project Settings → General → Your apps → Add Web app
   - Copy the Firebase config object

4. **Create Service Account**

   - Project Settings → Service accounts → Generate new private key
   - Download the JSON file

5. **Update Environment Files**

   **Update `.env` (root directory):**

   ```env
   FIREBASE_PROJECT_ID=your-actual-project-id
   FIREBASE_PRIVATE_KEY_ID=from-service-account-json
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-actual-private-key\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=from-service-account-json
   FIREBASE_CLIENT_ID=from-service-account-json
   ```

   **Update `client/.env`:**

   ```env
   REACT_APP_FIREBASE_API_KEY=your-actual-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-actual-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

### 4. Set Up GitHub OAuth

1. **Create GitHub OAuth App**

   - Go to [GitHub Settings](https://github.com/settings/developers) → OAuth Apps
   - Click "New OAuth App"
   - **Application name**: CelebrateHub
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000`

2. **Configure Firebase Auth**
   - Firebase Console → Authentication → Sign-in method → GitHub
   - Add your GitHub Client ID and Client Secret

### 5. Start the Application

```bash
# Option 1: Use the start script
./start-app.sh

# Option 2: Start manually
# Terminal 1 - Server
cd server && node index.js

# Terminal 2 - Client
cd client && npm start
```

### 6. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

## 📁 Project Structure

```
milestone-web-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Auth, Theme)
│   │   ├── config/         # Firebase configuration
│   │   └── services/       # API services
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── config/            # Firebase admin config
│   └── index.js
├── setup.sh              # Setup script
├── start-app.sh          # Start script
└── README.md
```

## 🔧 Manual Setup (Alternative)

If the setup script doesn't work, follow these manual steps:

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Client dependencies
cd client
npm install
cd ..
```

### 2. Environment Setup

Create `.env` in root directory:

```env
FIREBASE_PROJECT_ID=celebratehub-mvp
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email@celebratehub-mvp.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
OPENAI_API_KEY=your-openai-api-key
PORT=5001
NODE_ENV=development
```

Create `client/.env`:

```env
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=celebratehub-mvp.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=celebratehub-mvp
REACT_APP_FIREBASE_STORAGE_BUCKET=celebratehub-mvp.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
```

### 3. Start Applications

```bash
# Terminal 1 - Server (port 5001)
cd server && node index.js

# Terminal 2 - Client (port 3000)
cd client && npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Kill processes on ports 3000 and 5001
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5001 | xargs kill -9
   ```

2. **Firebase Authentication Not Working**

   - Check if GitHub OAuth is enabled in Firebase Console
   - Verify callback URL matches exactly: `http://localhost:3000`
   - Check browser console for errors

3. **Dependencies Not Installing**

   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Environment Variables Not Loading**
   - Ensure `.env` files are in correct locations
   - Restart the applications after updating `.env`
   - Check for typos in variable names

### Debug Mode

Enable debug logging:

```bash
# Set environment variable
export NODE_ENV=development

# Check server logs
cd server && node index.js

# Check client console (F12 in browser)
```

## 📚 Documentation

- [Firebase Setup Guide](FIREBASE_SETUP.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- [Deployment Guide](DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for authentication and database
- React for the frontend framework
- Framer Motion for animations
- Lucide React for icons

---

**Made with ❤️ for the developer community**
