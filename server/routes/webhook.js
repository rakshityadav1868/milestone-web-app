const express = require('express');
const { getFirestore } = require('../config/firebase');
const { detectMilestone, generateCelebrationPost } = require('../services/milestoneService');
const { sendToWebhook } = require('../services/webhookService');

const router = express.Router();

// GitHub webhook endpoint
router.post('/', async (req, res) => {
  try {
    const event = req.body;
    const eventType = req.headers['x-github-event'];
    
    console.log(`📥 Received ${eventType} event from GitHub`);

    // Store the event in Firebase
    const db = getFirestore();
    const eventData = {
      type: eventType,
      action: event.action || 'unknown',
      repository: {
        name: event.repository?.name || 'unknown',
        full_name: event.repository?.full_name || 'unknown',
        owner: event.repository?.owner?.login || 'unknown'
      },
      sender: {
        login: event.sender?.login || 'unknown',
        avatar_url: event.sender?.avatar_url || ''
      },
      timestamp: new Date().toISOString(),
      raw_data: event
    };

    // Save event to Firebase
    await db.collection('events').add(eventData);

    // Check for milestones
    const milestone = await detectMilestone(event, eventType);
    
    if (milestone) {
      console.log(`🎉 Milestone detected: ${milestone.type} - ${milestone.count}`);
      
      // Generate AI celebration post
      const celebrationPost = await generateCelebrationPost(milestone);
      
      // Save milestone to Firebase
      const milestoneData = {
        ...milestone,
        celebration_post: celebrationPost,
        created_at: new Date().toISOString()
      };
      
      await db.collection('milestones').add(milestoneData);

      // Send to webhooks if configured
      await sendToWebhook(milestone, celebrationPost);

      res.json({ 
        success: true, 
        milestone: milestone,
        celebration_post: celebrationPost 
      });
    } else {
      res.json({ 
        success: true, 
        message: 'Event processed, no milestone reached' 
      });
    }

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process webhook',
      message: error.message 
    });
  }
});

// Get all events (for debugging)
router.get('/events', async (req, res) => {
  try {
    const db = getFirestore();
    const eventsSnapshot = await db.collection('events')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
    
    const events = [];
    eventsSnapshot.forEach(doc => {
      events.push({ id: doc.id, ...doc.data() });
    });

    res.json({ events });
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;
