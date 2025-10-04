# CelebrateHub Backend

Express.js backend API server for the CelebrateHub milestone tracking system.

## Overview

This folder contains all server-side logic, including:
- REST API endpoints
- Database connections
- Authentication middleware
- Webhook handlers
- AI integration services

## Structure

```
backend/
├── config/                 # Configuration files
│   └── firebase.js
├── routes/                 # API route handlers
│   ├── ai.js
│   ├── github.js
│   ├── milestones.js
│   └── webhook.js
├── services/               # Business logic services
│   ├── aiService.js
│   ├── milestoneService.js
│   └── webhookService.js
├── server.js              # Main server entry point
├── index.js               # Alternative entry point
├── package.json
└── README.md
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp ../milestone-web-app/env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Start the production server:
   ```bash
   npm start
   ```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run server` - Start server (alias for start)

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/webhook` - GitHub webhook handler
- `GET /api/milestones` - Get milestones
- `POST /api/milestones` - Create milestone
- `PUT /api/milestones/:id` - Update milestone
- `DELETE /api/milestones/:id` - Delete milestone
- `POST /api/ai/generate` - AI-powered content generation
- `GET /api/github/repos` - Get GitHub repositories

## Dependencies

- Express.js
- Firebase Admin SDK
- OpenAI API
- CORS
- Helmet
- Express Rate Limit
- Body Parser

## Environment Variables

Required environment variables:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `OPENAI_API_KEY`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `PORT` (default: 5001)