# 🚀 Getting Started with CelebrateHub

**New to the project? This guide will get you up and running in 5 minutes!**

## 📋 What You Need

- **Node.js 16+** ([Download here](https://nodejs.org/))
- **Git** ([Download here](https://git-scm.com/))
- A code editor (VS Code recommended)

## 🎯 Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd milestone-web-app
```

### 2. Install Dependencies

**Choose ONE of these options:**

#### Option A: Automated Setup (Easiest)
```bash
chmod +x setup.sh
./setup.sh
```

#### Option B: Manual Setup
```bash
npm run install-all
```

> **⚠️ IMPORTANT**: You MUST run this step! The `node_modules` folders are not included in Git.

### 3. Start the Application

```bash
npm run dev-demo
```

### 4. Open Your Browser

Go to: **http://localhost:3000**

You should see the CelebrateHub dashboard! 🎉

## 🆘 Common Issues

### "Command not found" or "Module not found"

**Problem**: You skipped the dependency installation step.

**Solution**: Run this command:
```bash
npm run install-all
```

### "Port already in use"

**Problem**: Another app is using ports 3000 or 5001.

**Solution**: Kill existing processes:
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

### "Permission denied" on setup.sh

**Problem**: The setup script doesn't have execute permissions.

**Solution**: Run this command:
```bash
chmod +x setup.sh
./setup.sh
```

## 🎨 What You'll See

- Beautiful 3D interactive milestone cards
- Dark/light theme toggle
- Mock milestone data for demonstration
- Responsive design that works on mobile

## 🚀 Next Steps

Once you have the app running:

1. **Explore the dashboard** - Click around and see the features
2. **Read the main README** - Learn about advanced features
3. **Set up Firebase** - For real data storage (optional)
4. **Configure GitHub webhooks** - For real milestone tracking (optional)

## 💡 Tips

- The app runs in "demo mode" by default with mock data
- No external services (Firebase, OpenAI) are required for basic functionality
- Use `npm run dev-demo` for the easiest start
- Use `npm run dev` for full features (requires configuration)

## 🆘 Still Having Issues?

1. Check the [main README](./README.md) troubleshooting section
2. Make sure you have Node.js 16+ installed
3. Try deleting `node_modules` and running `npm run install-all` again
4. Check that ports 3000 and 5001 are free

---

**Happy coding! 🎉**
