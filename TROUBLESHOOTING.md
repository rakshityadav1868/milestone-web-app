# 🐛 Troubleshooting Guide

This guide helps you resolve common issues when setting up and running CelebrateHub.

## 🚀 Quick Fixes

### 1. Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Kill processes on ports 3000 and 5001
npm run kill-ports

# Or manually
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

### 2. Dependencies Not Installing

**Error**: `npm ERR!` or missing modules

**Solution**:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json

# Reinstall
npm install
cd client && npm install && cd ..
```

### 3. Firebase Authentication Not Working

**Symptoms**:
- GitHub login button doesn't work
- "Firebase not configured" warning
- Authentication popup doesn't open

**Solutions**:

1. **Check Firebase Console**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Ensure GitHub provider is enabled
   - Verify Client ID and Secret are correct

2. **Check GitHub OAuth App**:
   - Go to [GitHub Settings](https://github.com/settings/developers) → OAuth Apps
   - Verify callback URL is exactly: `http://localhost:3000`
   - Check Client ID and Secret match Firebase

3. **Check Environment Variables**:
   ```bash
   # Verify .env files exist and have correct values
   cat .env
   cat client/.env
   ```

4. **Check Browser Console**:
   - Open F12 → Console tab
   - Look for Firebase or authentication errors
   - Check for CORS errors

### 4. Server Not Starting

**Error**: `Firebase initialization failed`

**Solutions**:

1. **Check Service Account**:
   - Ensure `celebratehub-mvp-firebase-adminsdk-fbsvc-e4e69e7e5e.json` exists
   - Verify the JSON file is valid
   - Check if private key is properly formatted

2. **Check Environment Variables**:
   ```bash
   # Verify server .env has correct values
   cat .env | grep FIREBASE
   ```

3. **Test Firebase Connection**:
   ```bash
   # Test server startup
   cd server && node index.js
   ```

### 5. Client Not Starting

**Error**: `Something is already running on port 3000`

**Solutions**:
```bash
# Kill existing React process
pkill -f "react-scripts"

# Or use different port
cd client && PORT=3001 npm start
```

### 6. Environment Variables Not Loading

**Symptoms**:
- App shows "Firebase not configured"
- API calls fail
- Authentication doesn't work

**Solutions**:

1. **Check File Locations**:
   ```
   .env (root directory)
   client/.env (client directory)
   ```

2. **Check Variable Names**:
   - Root `.env`: `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, etc.
   - Client `.env`: `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_PROJECT_ID`, etc.

3. **Restart Applications**:
   ```bash
   # Stop all processes
   npm run kill-ports
   
   # Restart
   npm run dev
   ```

## 🔍 Debug Mode

### Enable Debug Logging

```bash
# Set debug environment
export NODE_ENV=development
export DEBUG=*

# Start server with debug
cd server && node index.js
```

### Check Server Logs

```bash
# Start server in foreground to see logs
cd server && node index.js

# Check for specific errors
cd server && node index.js 2>&1 | grep -i error
```

### Check Client Console

1. Open browser to `http://localhost:3000`
2. Press F12 → Console tab
3. Look for errors or warnings
4. Check Network tab for failed requests

## 🛠️ Advanced Troubleshooting

### 1. Complete Reset

```bash
# Stop all processes
npm run kill-ports

# Remove all dependencies
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall everything
npm install
cd client && npm install && cd ..

# Restart
npm run dev
```

### 2. Check System Requirements

```bash
# Check Node.js version
node --version  # Should be 18+

# Check npm version
npm --version   # Should be 8+

# Check available ports
lsof -i :3000
lsof -i :5001
```

### 3. Firebase Debugging

```bash
# Test Firebase connection
node -e "
const admin = require('firebase-admin');
const serviceAccount = require('./celebratehub-mvp-firebase-adminsdk-fbsvc-e4e69e7e5e.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
console.log('Firebase initialized successfully');
"
```

### 4. Network Issues

```bash
# Test server connectivity
curl http://localhost:5001/api/health

# Test client connectivity
curl http://localhost:3000

# Check if ports are listening
netstat -an | grep :3000
netstat -an | grep :5001
```

## 📋 Common Error Messages

### `Module not found: Can't resolve 'firebase'`

**Solution**: Install client dependencies
```bash
cd client && npm install
```

### `Error: Cannot find module 'express'`

**Solution**: Install server dependencies
```bash
npm install
```

### `FirebaseAppError: Failed to parse private key`

**Solution**: Check service account JSON file
- Ensure file exists and is valid JSON
- Check private key format (should have `\n` for newlines)

### `CORS error` or `Access to fetch at ... has been blocked`

**Solution**: Check server CORS configuration
- Ensure server is running on port 5001
- Check client proxy configuration in `client/package.json`

### `GitHub OAuth App not found`

**Solution**: Check GitHub OAuth configuration
- Verify Client ID and Secret in Firebase Console
- Check callback URL matches exactly: `http://localhost:3000`

## 🆘 Still Having Issues?

1. **Run the validation script**:
   ```bash
   node validate-setup.js
   ```

2. **Check the logs**:
   - Server: Terminal where you ran `npm run server`
   - Client: Browser console (F12)

3. **Verify your setup**:
   - Firebase project is created
   - GitHub OAuth app is configured
   - Environment variables are set correctly

4. **Try the setup script**:
   ```bash
   ./setup.sh
   ```

## 📞 Getting Help

If you're still stuck:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Run `node validate-setup.js` and share the output
3. Share error messages from console/logs
4. Include your operating system and Node.js version

---

**Remember**: Most issues are related to environment setup or port conflicts. The setup script should resolve most problems automatically! 🚀
