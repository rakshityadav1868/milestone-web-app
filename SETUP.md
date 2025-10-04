# 🛠️ CelebrateHub Setup Guide

Complete step-by-step setup instructions for CelebrateHub.

## 📋 Prerequisites

Before starting, ensure you have:

- [ ] Node.js 16+ installed
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] A GitHub account
- [ ] A Firebase account
- [ ] An OpenAI account

## 🚀 Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd celebratehub

# Install all dependencies
npm run install-all
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit with your credentials
nano .env  # or use your preferred editor
```

### 3. Start Development Server

```bash
# Start both backend and frontend
npm run dev
```

Visit `http://localhost:3000` to see your dashboard!

## 🔥 Firebase Setup (Detailed)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `celebratehub` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

### Step 3: Generate Service Account Key

1. Go to Project Settings (gear icon)
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Extract the following values for your `.env`:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",           // FIREBASE_PROJECT_ID
  "private_key_id": "your-key-id",           // FIREBASE_PRIVATE_KEY_ID
  "private_key": "-----BEGIN PRIVATE KEY-----\n...", // FIREBASE_PRIVATE_KEY
  "client_email": "your-email@project.iam.gserviceaccount.com", // FIREBASE_CLIENT_EMAIL
  "client_id": "your-client-id",             // FIREBASE_CLIENT_ID
  "auth_uri": "https://accounts.google.com/o/oauth2/auth", // FIREBASE_AUTH_URI
  "token_uri": "https://oauth2.googleapis.com/token" // FIREBASE_TOKEN_URI
}
```

### Step 4: Configure Firestore Security Rules

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (for development)
    // In production, implement proper security rules
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 🤖 OpenAI Setup

### Step 1: Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Complete account verification

### Step 2: Get API Key

1. Go to [API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name it: `celebratehub`
4. Copy the key (starts with `sk-`)
5. Add to your `.env` file:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### Step 3: Add Billing (Required)

1. Go to [Billing](https://platform.openai.com/account/billing)
2. Add a payment method
3. Set usage limits (recommended: $10-20/month)

## 📡 GitHub Webhook Setup

### Step 1: Choose Repository

Select a repository where you want to track milestones. This can be:
- Your personal project
- An open-source project you contribute to
- A test repository

### Step 2: Configure Webhook

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Webhooks" in the left sidebar
4. Click "Add webhook"
5. Configure the webhook:

```
Payload URL: http://localhost:5000/api/webhook (for development)
             https://your-domain.com/api/webhook (for production)

Content type: application/json

Which events: Select "Let me select individual events"
  ✅ Pull requests
  ✅ Issues  
  ✅ Pushes
  ✅ Stars

Active: ✅ (checked)
```

6. Click "Add webhook"

### Step 3: Test Webhook

1. Create a test pull request in your repository
2. Or star your repository
3. Check your CelebrateHub dashboard for the milestone

## 📱 Slack Integration (Optional)

### Step 1: Create Slack App

1. Go to [Slack API](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From scratch"
4. Name: `CelebrateHub`
5. Select your workspace

### Step 2: Enable Incoming Webhooks

1. Go to "Incoming Webhooks"
2. Toggle "Activate Incoming Webhooks" to On
3. Click "Add New Webhook to Workspace"
4. Choose a channel (e.g., #general)
5. Copy the webhook URL

### Step 3: Add to Environment

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK/URL
```

## 💬 Discord Integration (Optional)

### Step 1: Create Discord Webhook

1. Go to your Discord server
2. Right-click on a channel
3. Select "Edit Channel"
4. Go to "Integrations" tab
5. Click "Create Webhook"
6. Name it: `CelebrateHub`
7. Copy the webhook URL

### Step 2: Add to Environment

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK/URL
```

## 🧪 Testing Your Setup

### Test 1: Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "CelebrateHub API"
}
```

### Test 2: Frontend Loading

1. Open `http://localhost:3000`
2. You should see the CelebrateHub dashboard
3. Check browser console for errors

### Test 3: GitHub Webhook

1. Create a pull request in your test repository
2. Check the CelebrateHub dashboard
3. You should see the milestone appear

### Test 4: AI Post Generation

1. Click on a milestone card
2. Click "Generate Post"
3. You should see an AI-generated celebration post

## 🔧 Development Commands

```bash
# Start development server (both backend and frontend)
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build for production
npm run build

# Install all dependencies
npm run install-all
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Firebase not initialized" Error

**Solution:**
- Check your `.env` file has all Firebase variables
- Verify the private key format (with `\n` for newlines)
- Ensure Firebase project exists and Firestore is enabled

#### 2. "OpenAI API key not found" Error

**Solution:**
- Verify `OPENAI_API_KEY` is set in `.env`
- Check the API key is valid and has billing enabled
- Ensure no extra spaces or quotes around the key

#### 3. Frontend Not Loading

**Solution:**
- Check if backend is running on port 5000
- Verify no port conflicts
- Check browser console for errors

#### 4. Webhook Not Receiving Events

**Solution:**
- Verify webhook URL is correct
- Check if your server is accessible from GitHub
- Review server logs for errors
- Test webhook with curl:

```bash
curl -X POST http://localhost:5000/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: pull_request" \
  -d '{"action": "opened", "repository": {"name": "test"}, "sender": {"login": "testuser"}}'
```

### Debug Mode

Enable detailed logging:

```env
NODE_ENV=development
```

Check logs in terminal where you ran `npm run dev`.

## 📊 Database Schema

Your Firebase Firestore will have these collections:

```
events/
  ├── {eventId}/
      ├── type: "pull_request" | "star" | "issue" | "push"
      ├── action: "opened" | "closed" | "created"
      ├── repository: {name, full_name, owner}
      ├── sender: {login, avatar_url}
      ├── timestamp: "2024-01-01T00:00:00.000Z"
      └── raw_data: {...}

milestones/
  ├── {milestoneId}/
      ├── type: "pull_request" | "star" | "issue" | "commit" | "contribution_days"
      ├── count: 10
      ├── repository: "owner/repo"
      ├── contributor: "username"
      ├── celebration_post: "🎉 Amazing work..."
      └── created_at: "2024-01-01T00:00:00.000Z"

contributor_stats/
  ├── {repo_contributor}/
      ├── pull_requests: 5
      ├── stars: 2
      ├── issues: 3
      ├── commits: 25
      ├── contribution_days: ["2024-01-01", "2024-01-02"]
      └── last_updated: "2024-01-01T00:00:00.000Z"
```

## 🎯 Next Steps

After successful setup:

1. **Customize Milestones**: Edit `server/services/milestoneService.js` to add new milestone types
2. **Style Dashboard**: Modify `client/src/index.css` and components
3. **Deploy**: Follow the deployment guide to put your app online
4. **Monitor**: Check logs and analytics to see how your app is performing

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review the main README.md
3. Check the deployment guide
4. Create an issue in the repository
5. Check server logs for specific error messages

---

**Happy coding and celebrating! 🎉**
