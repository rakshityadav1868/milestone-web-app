# 🚀 CelebrateHub Deployment Guide

This guide covers deploying CelebrateHub to various platforms.

## 📋 Pre-deployment Checklist

- [ ] Firebase project created and configured
- [ ] OpenAI API key obtained
- [ ] GitHub repository with webhook access
- [ ] Environment variables prepared
- [ ] Domain name ready (optional)

## 🌐 Vercel Deployment (Recommended)

### 1. Prepare for Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

### 2. Deploy

```bash
# From project root
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? celebratehub
# - Directory? ./
# - Override settings? N
```

### 3. Configure Environment Variables

In Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables from your `.env` file:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
OPENAI_API_KEY=sk-your-openai-key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
NODE_ENV=production
```

### 4. Update GitHub Webhook

1. Go to your repository settings
2. Edit the webhook URL to: `https://your-app.vercel.app/api/webhook`
3. Test the webhook

## 🐳 Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
```

### 2. Build and Run

```bash
# Build image
docker build -t celebratehub .

# Run container
docker run -p 5000:5000 --env-file .env celebratehub
```

## ☁️ Render Deployment

### 1. Connect Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the CelebrateHub repository

### 2. Configure Service

```
Name: celebratehub
Environment: Node
Build Command: npm run install-all && cd client && npm run build
Start Command: npm start
```

### 3. Environment Variables

Add all environment variables in the Render dashboard.

## 🚂 Railway Deployment

### 1. Connect to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### 2. Deploy

```bash
# Deploy
railway up

# Set environment variables
railway variables set FIREBASE_PROJECT_ID=your-project-id
railway variables set OPENAI_API_KEY=your-key
# ... add all other variables
```

## 🐋 DigitalOcean App Platform

### 1. Create App Spec

Create `app.yaml`:

```yaml
name: celebratehub
services:
- name: web
  source_dir: /
  github:
    repo: your-username/celebratehub
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: FIREBASE_PROJECT_ID
    value: your-project-id
  # ... add all other environment variables
```

### 2. Deploy

```bash
# Install doctl
# Follow DigitalOcean CLI setup

# Create app
doctl apps create --spec app.yaml
```

## 🔧 Environment-Specific Configuration

### Development

```env
NODE_ENV=development
PORT=5000
# Use local Firebase emulator if needed
```

### Production

```env
NODE_ENV=production
PORT=5000
# Use production Firebase project
# Use production OpenAI API
```

## 📊 Monitoring and Logs

### Vercel

- View logs in Vercel dashboard
- Monitor function execution
- Check build logs

### Docker

```bash
# View logs
docker logs <container-id>

# Follow logs
docker logs -f <container-id>
```

### Render

- View logs in Render dashboard
- Monitor service health
- Check build logs

## 🔍 Health Checks

### API Health Endpoint

```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "CelebrateHub API"
}
```

### Frontend Health

Visit your domain - should show the CelebrateHub dashboard.

## 🚨 Troubleshooting Deployment

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify no extra spaces or quotes

3. **Database Connection**
   - Verify Firebase credentials
   - Check Firestore rules
   - Ensure service account has proper permissions

4. **Webhook Issues**
   - Verify webhook URL is accessible
   - Check GitHub webhook configuration
   - Review server logs for errors

### Debug Commands

```bash
# Check environment variables
printenv | grep -E "(FIREBASE|OPENAI|SLACK|DISCORD)"

# Test API endpoints
curl -X GET https://your-domain.com/api/health
curl -X GET https://your-domain.com/api/milestones

# Check webhook
curl -X POST https://your-domain.com/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./
```

## 📈 Performance Optimization

### Production Optimizations

1. **Enable Compression**
   ```javascript
   app.use(compression());
   ```

2. **Set Cache Headers**
   ```javascript
   app.use(express.static('client/build', {
     maxAge: '1y'
   }));
   ```

3. **Database Indexing**
   - Add Firestore indexes for common queries
   - Optimize collection structure

4. **CDN Configuration**
   - Use Vercel's global CDN
   - Configure custom domains

## 🔐 Security Considerations

### Environment Security

- Never commit `.env` files
- Use environment variable management
- Rotate API keys regularly
- Use least-privilege service accounts

### API Security

- Rate limiting enabled
- CORS properly configured
- Input validation
- Error handling without sensitive data

### Firebase Security

- Configure Firestore security rules
- Use service account with minimal permissions
- Enable audit logging
- Monitor access patterns

---

**Ready to celebrate milestones! 🎉**
