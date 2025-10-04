# 🎉 CelebrateHub - GitHub Milestone Celebration System

A modern full-stack application that tracks GitHub repository milestones and generates AI-powered celebration posts for contributors' achievements. Built with React, Node.js, Firebase, and OpenAI.

## ✨ Features

- 🔗 **GitHub Webhook Integration** - Automatically tracks PRs, stars, issues, commits
- 🤖 **AI-Powered Posts** - Generate engaging celebration posts using OpenAI GPT
- 📊 **Real-time Dashboard** - Beautiful React dashboard with milestone tracking
- 🔥 **Firebase Database** - Scalable data storage and retrieval
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎊 **Confetti Animations** - Celebrate new milestones with visual effects
- 🎨 **3D Interactive Cards** - Modern UI with smooth 3D hover effects
- 🌙 **Dark/Light Theme** - Automatic theme switching with system preference
- 📤 **Auto-posting** - Send celebrations to Slack/Discord automatically
- 🏆 **Badge System** - Track contributor achievements and milestones

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** and npm
- **Firebase project** (for production)
- **OpenAI API key** (optional, has fallback messages)
- **GitHub repository** (for webhook setup)

### 🆕 Firebase MVP Version

For the complete Firebase MVP with GitHub authentication, real-time updates, and LinkedIn sharing, see the [Firebase Setup Guide](./FIREBASE_SETUP.md).

**Firebase MVP Features:**

- 🔐 GitHub OAuth authentication
- 📱 Real-time milestone tracking
- 🎨 Modern animated landing page
- 📊 Personalized dashboard
- 🔗 LinkedIn sharing integration
- ☁️ Cloud Functions for webhooks

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd milestones
npm run install-all
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` with your credentials (all optional for demo mode):

```env
# Firebase Configuration (Optional - demo mode works without)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# OpenAI Configuration (Optional - has fallback messages)
OPENAI_API_KEY=your-openai-api-key

# Webhook URLs (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/slack/webhook
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your/discord/webhook

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Run the Application

#### Option 1: Demo Mode (Recommended for testing)

```bash
npm run dev-demo
```

This runs the app with mock data - no Firebase or OpenAI required!

#### Option 2: Full Production Mode

```bash
npm run dev
```

This requires Firebase and OpenAI configuration.

#### Option 3: Quick Start Script

```bash
./start.sh
```

This automatically starts both frontend and backend with demo data.

## 🌐 Access the Application

Once running, open your browser to:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001 (demo) or http://localhost:5000 (full)
- **Health Check**: http://localhost:5001/api/health

## 📡 GitHub Webhook Setup (Optional)

### 1. Configure Webhook in GitHub

1. Go to your repository settings
2. Navigate to "Webhooks" section
3. Click "Add webhook"
4. Set the payload URL to: `https://your-domain.com/api/webhook`
5. Select content type: `application/json`
6. Select events: `Pull requests`, `Issues`, `Pushes`, `Stars`
7. Make sure "Active" is checked
8. Click "Add webhook"

### 2. Test Webhook

Create a test PR or star your repository to trigger the webhook and see milestones appear in your dashboard.

## 🎯 Milestone Detection

The system automatically detects these milestones:

### Pull Requests

- 1st, 5th, 10th, 25th, 50th, 100th PR merged

### Stars

- 1st, 10th, 25th, 50th, 100th, 500th, 1000th star

### Issues

- 1st, 5th, 10th, 25th, 50th issue opened

### Commits

- 10th, 50th, 100th, 500th, 1000th commit

### Contribution Days

- 7, 30, 90, 180, 365 consecutive days

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Set environment variables in Vercel dashboard:

   - Go to your project settings
   - Add all variables from your `.env` file

4. Update your GitHub webhook URL to point to your Vercel deployment

### Alternative Deployment Options

The app can also be deployed to:

- **Render** - Full-stack deployment
- **Heroku** - With buildpacks for Node.js
- **Railway** - Simple deployment with database
- **DigitalOcean App Platform** - Managed deployment

## 🎨 Customization

### Adding New Milestone Types

Edit `server/services/milestoneService.js`:

```javascript
const MILESTONE_THRESHOLDS = {
  // Add your custom milestone type
  custom_event: [1, 5, 10, 25, 50, 100],
};
```

### Customizing AI Prompts

Modify `server/services/aiService.js` to change the celebration post style:

```javascript
const prompt = `
Generate a celebration post for:
Repository: ${repository}
Contributor: ${contributor}
Achievement: ${count} ${type}

Make it:
- Under 200 characters
- Include relevant emojis
- Professional but fun tone
- Perfect for social media
`;
```

### Styling the Dashboard

The frontend uses Tailwind CSS. Customize colors in `client/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

## 📊 API Endpoints

### Webhook Endpoint

- `POST /api/webhook` - GitHub webhook receiver

### Milestones

- `GET /api/milestones` - Get all milestones
- `GET /api/milestones/contributor/:username` - Get contributor milestones
- `GET /api/milestones/repository/:repo` - Get repository milestones
- `GET /api/milestones/stats` - Get milestone statistics

### AI Generation

- `POST /api/ai/generate-post` - Generate celebration post
- `POST /api/ai/generate-custom` - Generate custom post

### Health Check

- `GET /api/health` - Service health status

## 🔧 Configuration

### Environment Variables

| Variable                | Description                          | Required          |
| ----------------------- | ------------------------------------ | ----------------- |
| `FIREBASE_PROJECT_ID`   | Firebase project ID                  | No (demo mode)    |
| `FIREBASE_PRIVATE_KEY`  | Firebase service account key         | No (demo mode)    |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email       | No (demo mode)    |
| `OPENAI_API_KEY`        | OpenAI API key for AI posts          | No (has fallback) |
| `SLACK_WEBHOOK_URL`     | Slack webhook for auto-posting       | No                |
| `DISCORD_WEBHOOK_URL`   | Discord webhook for auto-posting     | No                |
| `PORT`                  | Server port (default: 5000)          | No                |
| `NODE_ENV`              | Environment (development/production) | No                |

### Firebase Database Schema

```
events/
  - type: string (pull_request, star, issue, push)
  - action: string (opened, closed, created)
  - repository: object {name, full_name, owner}
  - sender: object {login, avatar_url}
  - timestamp: string
  - raw_data: object

milestones/
  - type: string
  - count: number
  - repository: string
  - contributor: string
  - celebration_post: string
  - created_at: string

contributor_stats/
  - pull_requests: number
  - stars: number
  - issues: number
  - commits: number
  - contribution_days: array
  - last_updated: string
```

## 🐛 Troubleshooting

### Common Issues

1. **Dependencies not installed**

   ```bash
   npm run install-all
   ```

2. **Port already in use**

   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`
   - Or change ports in package.json

3. **Frontend not loading**

   - Check if backend is running on port 5001 (demo) or 5000 (full)
   - Verify API endpoints are accessible
   - Check browser console for errors

4. **Webhook not receiving events**

   - Check GitHub webhook configuration
   - Verify your server is accessible
   - Check server logs for errors

5. **Firebase connection issues**
   - Verify service account credentials
   - Check Firebase project settings
   - Ensure Firestore is enabled

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

## 🛠️ Development

### Project Structure

```
milestones/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── config/            # Configuration
│   └── index.js           # Main server file
├── start.sh               # Quick start script
└── package.json           # Root package.json
```

### Available Scripts

- `npm run dev` - Start full production mode
- `npm run dev-demo` - Start demo mode (recommended)
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build for production
- `npm run install-all` - Install all dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Firebase for database services
- React and Tailwind CSS for the frontend
- GitHub for webhook integration
- Vercel for deployment platform

## 📞 Support

For issues and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Made with ❤️ for the developer community**

## 🎯 Quick Demo

Want to see it in action immediately? Run:

```bash
./start.sh
```

Then open http://localhost:3000 to see the beautiful dashboard with mock milestone data!
