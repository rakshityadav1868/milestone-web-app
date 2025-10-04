# 🔥 Firebase Configuration Guide for CelebrateHub

## 📋 Prerequisites Completed ✅

- ✅ Firebase project created: `milestonehub-16c64`
- ✅ Service account credentials provided
- ✅ Firebase CLI installed
- ✅ Cloud Functions dependencies installed

## 🚀 Step-by-Step Configuration

### 1. Create Environment Files

You need to create two environment files manually since they're blocked by gitignore:

#### **Root `.env` file** (for server-side Firebase):

```bash
# Create the file
touch .env
```

Add this content to `.env`:

```env
# Firebase Configuration (Server-side)
FIREBASE_PROJECT_ID=milestonehub-16c64
FIREBASE_PRIVATE_KEY_ID=fb5a39f437aca955880f39de206767c044633445
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCigDx0kX1GwibZ\nTAMJewpnYehiGWkPb15UoTgZztSMUWjpn3lSutDj/V8Lex0j7z2KzFInOC6FGLhf\n7BChJOQIOJY0kToDnRVz7zpsdIOHc4OgRC2UL63cPQKHXAYwR5IfINFw6MGWLAUG\nUz014gF9PcLEVgofSMWuBPJSKS5VnZ2656xhlEQ3KEKg5GHWu1M17RmmgBDVZxja\nO6fCPYYKojmoa2IZlSgITuCfGfcNYTL1+hsoSGVzp23qq5vkCBrX1yNERbF0idMM\n9Cr47Js0DZbQgcxok5Pi09hGmWjJ1tSedIc7iNWG1aBmCbGufYL8RvJypLvgjKng\nRRmausCRAgMBAAECggEATrNElEASKD7Hid3iaqkIdOFaJoif9TW+vcYG4ZjmH78d\nzGfL3mFT4ddIPMs3ZbvsVlh2QUBYZ2V9hhdSRnkTZ1fghzz+l9lwFmH6LaSQPv2W\n9fuPB4G/9jYmD2BmLuO6xRCj3scbWpufI10U/A+lIP7UYTo6VMRt2MXUhi4jnpqd\ncB+iWh5B14sCs3EaJEqFvkMxAfdK2Sxt3JlNQUP3wHGJC8ozAgDpBe/bC8SMAf+y\nMKwZ1Yg8TdSOTzasF7TUaQSn54140bp0rxQeyv2XRBxnbnrlyFWqewOhPr1roPsa\nUlq5Zlkn4Bx4l1p72CB1nbVN/6cOpkcaaAZO8RCzMQKBgQDYJ7UuHzPIodTZxmHW\nNUrRoL+I6A2C72tpPCbE90t7qp9A1qusAjJQhuVRYgOg0BtxEcCZnuaK1+77tVzM\n//4cAGCRemkDOQ6coOYOE0Tt1C5R3gKumlQ8WMoWuHVF4wiDrE6TlEPO3ES2rf1Q\nwRAyX92q4cWUq0BotE2iiyKKSwKBgQDAdJqlzGvvpd6SABCM8S+klK+/vZLwW89u\nHfm0zGtvSaTBKA5gRb9YXqiwRzBHBfpDMfU4GElqrJ5xFLcVwGHHoFGOsI6zNQjj\nbnfio4v6Zxn9dp+aLq7yOwsb5wB3swkSN3BZqFiPF7TAImyO+gn/fIuDFPG/9Web\newDME6FXEwKBgQDRxedtdVaaFYQuPPriGiIcQvbe9OV39sa1AG1Xpe+ZesLG+A7v\nBcqyn9eZHZgLzytylhnmfHGcuWby3NXNFXsUzcDqLnQPbqYhl3zsmALDFLJHPUA5\nFwk876ZgWm9lfanbr7MqQi90aAw/hadbYaJIYQUNO8K2P2RouOLHJmRE9QKBgGQB\nc4bqNcA++ev2GqOShMZJ+RVyphM+MgivjN01SDJ5GyK/9NB0Dd0WuyN2qpCNe6FF\nKX6vqB7FekOalxS3dlfsZ9T0zAI1cdv0wFlF0OwafTfnV0IgNgprQfeKzwRkRTdx\nFXGReAtLL0KT4MNfDKj1B+3iiUjNdbwma6CgJrt/AoGBAKebIjiWGMYl7jIFVXac\nYkS2efmNyExo7BGhjeNy3v9D4/fpHYxCtGoPfmHBs1W9fpEMQNaZf39oClyO5tvo\nbAnTPl1z2PBuU0unNEf/lzfgFLcMSKVkukZh1O9lFex9JxN9FqKx6i+lEtz7cCTN\nQluiTBy7mB0oZPEjqm6Oj6v9\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@milestonehub-16c64.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=111233038865624206784
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### **Client `.env.local` file** (for client-side Firebase):

```bash
# Create the file
touch client/.env.local
```

**⚠️ IMPORTANT**: You need to get the client-side Firebase config from your Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `milestonehub-16c64`
3. Go to Project Settings (gear icon) > General tab
4. Scroll down to "Your apps" section
5. Click "Add app" > Web app (</>) icon
6. Register your app with name "CelebrateHub"
7. Copy the Firebase config object

Add this content to `client/.env.local` (replace with your actual values):

```env
# Firebase Configuration (Client-side)
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=milestonehub-16c64.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=milestonehub-16c64
REACT_APP_FIREBASE_STORAGE_BUCKET=milestonehub-16c64.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
REACT_APP_FIREBASE_APP_ID=your-actual-app-id
```

### 2. Enable Firebase Services

#### **Enable Authentication:**

1. Go to Firebase Console > Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "GitHub" provider
5. You'll need to create a GitHub OAuth App first (see step 3)

#### **Enable Firestore:**

1. Go to Firebase Console > Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location (choose closest to your users)

#### **Enable Functions:**

1. Go to Firebase Console > Functions
2. Click "Get started"
3. This will enable Cloud Functions for your project

### 3. Create GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: CelebrateHub
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `https://milestonehub-16c64.firebaseapp.com/__/auth/handler`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

#### **Configure GitHub in Firebase:**

1. Go back to Firebase Console > Authentication > Sign-in method
2. Click on "GitHub" provider
3. Paste your GitHub Client ID and Client Secret
4. Click "Save"

### 4. Deploy Cloud Functions

```bash
# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Use existing project: milestonehub-16c64
# - Functions: Configure a Cloud Functions directory (select functions/)
# - TypeScript: Yes
# - ESLint: Yes
# - Install dependencies: Yes

# Build and deploy functions
cd functions
npm run build
firebase deploy --only functions
```

### 5. Test the Setup

#### **Start the development server:**

```bash
# From the root directory
npm run dev
```

#### **Test Firebase Authentication:**

1. Open http://localhost:3000
2. Click "Let's Celebrate 🎉" button
3. You should see GitHub OAuth popup
4. After login, you should see the personalized dashboard

### 6. Set Up GitHub Webhook (Optional)

1. Go to your GitHub repository settings
2. Navigate to "Webhooks" section
3. Click "Add webhook"
4. Set payload URL to: `https://us-central1-milestonehub-16c64.cloudfunctions.net/githubWebhook`
5. Select content type: `application/json`
6. Select events: `Pull requests`, `Issues`, `Pushes`, `Stars`
7. Click "Add webhook"

## 🎯 What You'll Have After Setup

### ✅ **Working Features:**

- 🔐 GitHub OAuth authentication
- 📱 Real-time personalized dashboard
- 🎨 Beautiful landing page with animations
- 📊 Milestone tracking and statistics
- 🔗 LinkedIn sharing integration
- ☁️ Cloud Functions for webhook processing

### 🚀 **Next Steps:**

1. Create the environment files as described above
2. Get Firebase client config from console
3. Enable GitHub OAuth in Firebase
4. Deploy Cloud Functions
5. Test the authentication flow

## 🔧 Troubleshooting

### **Common Issues:**

1. **"Firebase config not found"**

   - Make sure `client/.env.local` exists and has correct values
   - Restart the development server after creating the file

2. **"GitHub OAuth not working"**

   - Check GitHub OAuth app callback URL
   - Verify Client ID and Secret in Firebase Console

3. **"Functions deployment failed"**

   - Make sure you're logged in: `firebase login`
   - Check if project is selected: `firebase use milestonehub-16c64`

4. **"Permission denied"**
   - Make sure Firestore is in test mode
   - Check Firestore security rules

### **Debug Commands:**

```bash
# Check Firebase project
firebase projects:list

# Check current project
firebase use

# View function logs
firebase functions:log

# Test functions locally
firebase emulators:start --only functions
```

---

**🎉 Once configured, your CelebrateHub will be a fully functional Firebase MVP with real-time GitHub milestone tracking!**
