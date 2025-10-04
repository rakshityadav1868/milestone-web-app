# 🚀 CelebrateHub - Quick Setup Guide

Welcome to CelebrateHub! This guide will help you get the application running in just a few simple steps.

## 📋 Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (version 8 or higher)

To check your versions:

```bash
node --version
npm --version
```

## ⚡ One-Command Setup

After cloning the repository, simply run:

```bash
npm run setup
```

That's it! The setup script will:

- ✅ Check your system requirements
- ✅ Install all dependencies (root, client, server, functions)
- ✅ Verify everything is working
- ✅ Show you how to start the app

## 🎯 Starting the Application

After setup completes, you have two options:

### Option 1: Demo Mode (Recommended for first run)

```bash
npm run dev-demo
```

- No API keys required
- Uses mock data
- Perfect for exploring the interface

### Option 2: Full Mode (Requires configuration)

```bash
npm run dev
```

- Requires Firebase and OpenAI API keys
- Full functionality with real data

## 🌐 Access the Application

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health

## 🛑 Stopping the Application

Press `Ctrl+C` in the terminal to stop both frontend and backend servers.

## 🔧 Troubleshooting

### If setup fails:

1. Make sure you have Node.js 16+ and npm 8+
2. Try running `npm run setup` again
3. Check the error messages for specific issues

### If the app won't start:

1. Make sure ports 3000 and 5001 are not in use
2. Try running `npm run kill-ports` to free up ports
3. Restart with `npm run dev-demo`

### Common Issues:

- **"concurrently: command not found"**: Run `npm install` first
- **"OPENAI_API_KEY missing"**: Use `npm run dev-demo` instead of `npm run dev`
- **Port already in use**: Run `npm run kill-ports` then try again

## 📚 Additional Resources

- **Full Documentation**: See `README.md` for detailed information
- **Configuration**: See `FIREBASE_SETUP.md` for API key configuration
- **Troubleshooting**: See `TROUBLESHOOTING.md` for more help

## 🎉 You're All Set!

The setup script handles everything automatically. Just run `npm run setup` and you'll be ready to explore CelebrateHub!

---

_Need help? Check the troubleshooting section or open an issue on GitHub._
