# CelebrateHub

A milestone celebration system for GitHub repositories with AI-powered content generation and interactive backgrounds.

## Project Structure

This project is organized into two main folders:

```
hibro/
├── frontend/              # React frontend application
├── backend/               # Express.js API server
└── README.md
```

## Quick Start

### Install All Dependencies
```bash
npm run install:all
```

### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

### Individual Development

**Frontend only:**
```bash
npm run dev:frontend
```
Runs on http://localhost:3000

**Backend only:**
```bash
npm run dev:backend
```
Runs on http://localhost:5001

## Features

- 🎯 **Interactive Background** - Canvas-based morphing effects with circular lens distortion
- 🎉 **Milestone Tracking** - GitHub milestone celebration system
- 🤖 **AI Integration** - OpenAI-powered content generation
- 🔐 **Authentication** - GitHub OAuth integration
- 🎨 **Modern UI** - Tailwind CSS with smooth animations
- 📱 **Responsive** - Works on all device sizes

## Technology Stack

- **Frontend**: React 18, React Router, Framer Motion, Tailwind CSS
- **Backend**: Express.js, Firebase Admin SDK, OpenAI API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth with GitHub OAuth

## Development

Each folder can be developed independently:

1. **Frontend** - React app with hot reload
2. **Backend** - Express server with nodemon

## Scripts

- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run install:all` - Install all dependencies
- `npm run build:frontend` - Build frontend for production
- `npm run start:backend` - Start backend in production mode

## Deployment

- Frontend can be deployed to Vercel, Netlify, or similar
- Backend can be deployed to Railway, Heroku, or similar

## Contributing

1. Make changes in the appropriate folder
2. Test both frontend and backend independently
3. Ensure all imports are correctly updated