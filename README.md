# 🎉 CelebrateHub - GitHub Milestone Celebration System

A complete full-stack application that tracks GitHub repository milestones and generates AI-powered celebration posts for contributors' achievements.

## ✨ Features

- 🔗 **GitHub Webhook Integration** - Automatically tracks PRs, stars, issues, commits
- 🤖 **AI-Powered Posts** - Generate engaging celebration posts using OpenAI
- 📊 **Real-time Dashboard** - Beautiful React dashboard with milestone tracking
- 🔥 **Firebase Database** - Scalable data storage and retrieval
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎊 **Confetti Animations** - Celebrate new milestones with visual effects
- 📤 **Auto-posting** - Send celebrations to Slack/Discord automatically
- 🏆 **Badge System** - Track contributor achievements and milestones

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Firebase project
- OpenAI API key
- GitHub repository (for webhook setup)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd celebratehub
npm run install-all
```

### 2. Environment Setup

Copy the example environment file and configure your keys:

```bash
cp env.example .env
```

Edit `.env` with your credentials:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Webhook URLs (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/slack/webhook
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your/discord/webhook

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file and extract the values for your `.env`

### 4. OpenAI Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file

### 5. Run Development Server

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000).

## 📡 GitHub Webhook Setup

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

### Deploy to Vercel

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

### Alternative Deployment

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
  custom_event: [1, 5, 10, 25, 50, 100]
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

| Variable | Description | Required |
|----------|-------------|----------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_PRIVATE_KEY` | Firebase service account key | Yes |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI posts | Yes |
| `SLACK_WEBHOOK_URL` | Slack webhook for auto-posting | No |
| `DISCORD_WEBHOOK_URL` | Discord webhook for auto-posting | No |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

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

1. **Webhook not receiving events**
   - Check GitHub webhook configuration
   - Verify your server is accessible
   - Check server logs for errors

2. **Firebase connection issues**
   - Verify service account credentials
   - Check Firebase project settings
   - Ensure Firestore is enabled

3. **AI posts not generating**
   - Verify OpenAI API key
   - Check API quota and billing
   - Review error logs

4. **Frontend not loading**
   - Check if backend is running
   - Verify API endpoints are accessible
   - Check browser console for errors

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

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
