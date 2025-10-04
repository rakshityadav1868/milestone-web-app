const express = require('express');
const { generateCelebrationPost } = require('../services/aiService');

const router = express.Router();

// Generate celebration post
router.post('/generate-post', async (req, res) => {
  try {
    const { milestone } = req.body;
    
    if (!milestone) {
      return res.status(400).json({ error: 'Milestone data is required' });
    }

    const celebrationPost = await generateCelebrationPost(milestone);
    
    res.json({ 
      success: true,
      celebration_post: celebrationPost 
    });
  } catch (error) {
    console.error('❌ Error generating celebration post:', error);
    res.status(500).json({ 
      error: 'Failed to generate celebration post',
      message: error.message 
    });
  }
});

// Generate custom celebration post
router.post('/generate-custom', async (req, res) => {
  try {
    const { 
      repoName, 
      userName, 
      eventType, 
      count, 
      customPrompt 
    } = req.body;
    
    if (!repoName || !userName || !eventType || !count) {
      return res.status(400).json({ 
        error: 'repoName, userName, eventType, and count are required' 
      });
    }

    const milestone = {
      repository: repoName,
      contributor: userName,
      type: eventType,
      count: count
    };

    const celebrationPost = await generateCelebrationPost(milestone, customPrompt);
    
    res.json({ 
      success: true,
      celebration_post: celebrationPost 
    });
  } catch (error) {
    console.error('❌ Error generating custom celebration post:', error);
    res.status(500).json({ 
      error: 'Failed to generate custom celebration post',
      message: error.message 
    });
  }
});

module.exports = router;
