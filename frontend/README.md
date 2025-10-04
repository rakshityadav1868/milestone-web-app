# CelebrateHub Frontend

React-based frontend application for the CelebrateHub milestone tracking system.

## Overview

This folder contains all client-side React code, including:
- Pages and components
- UI logic and state management
- Routing configuration
- Firebase integration
- Interactive background effects

## Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── InteractiveBackground.js
│   │   ├── LandingPage.js
│   │   ├── PersonalDashboard.js
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── config/             # Configuration files
│   │   └── firebase.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── App.js              # Main app component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json
└── README.md
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm start` - Start production server

## Features

- 🎯 **Interactive Background** - Canvas-based morphing effects with circular lens distortion
- 🎉 **Milestone Tracking** - GitHub milestone celebration system
- 🔐 **Authentication** - GitHub OAuth integration
- 🎨 **Modern UI** - Tailwind CSS with smooth animations
- 📱 **Responsive** - Works on all device sizes

## Dependencies

- React 18
- React Router DOM
- Framer Motion
- Firebase
- Tailwind CSS
- Lucide React