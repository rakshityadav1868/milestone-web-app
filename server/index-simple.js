const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data for testing
const mockMilestones = [
  {
    id: '1',
    type: 'pull_request',
    count: 10,
    repository: 'test/repo',
    contributor: 'testuser',
    celebration_post: '🎉 Amazing! testuser just merged their 10th PR in test/repo! 🚀',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    type: 'star',
    count: 100,
    repository: 'test/repo',
    contributor: 'testuser',
    celebration_post: '🌟 Incredible! test/repo just hit 100 stars! Thanks to the amazing community! ⭐',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CelebrateHub API (Demo Mode)'
  });
});

app.get('/api/milestones', (req, res) => {
  res.json({ milestones: mockMilestones });
});

app.get('/api/milestones/stats', (req, res) => {
  res.json({
    total_milestones: mockMilestones.length,
    unique_contributors: 1,
    milestone_types: {
      pull_request: 1,
      star: 1
    }
  });
});

app.post('/api/webhook', (req, res) => {
  console.log('📥 Received webhook:', req.headers['x-github-event']);
  res.json({ success: true, message: 'Webhook received (demo mode)' });
});

app.post('/api/ai/generate-post', (req, res) => {
  const { milestone } = req.body;
  const celebrationPost = `🎉 Congratulations to ${milestone.contributor} for reaching ${milestone.count} ${milestone.type} in ${milestone.repository}! 🎉`;
  res.json({ success: true, celebration_post: celebrationPost });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 CelebrateHub server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Demo Mode: Using mock data (Firebase not configured)`);
});
