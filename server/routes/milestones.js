const express = require('express');
const { getFirestore } = require('../config/firebase');

const router = express.Router();

// Get all milestones
router.get('/', async (req, res) => {
  try {
    const db = getFirestore();
    const milestonesSnapshot = await db.collection('milestones')
      .orderBy('created_at', 'desc')
      .get();
    
    const milestones = [];
    milestonesSnapshot.forEach(doc => {
      milestones.push({ id: doc.id, ...doc.data() });
    });

    res.json({ milestones });
  } catch (error) {
    console.error('❌ Error fetching milestones:', error);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
});

// Get milestones by contributor
router.get('/contributor/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const db = getFirestore();
    
    const milestonesSnapshot = await db.collection('milestones')
      .where('contributor', '==', username)
      .orderBy('created_at', 'desc')
      .get();
    
    const milestones = [];
    milestonesSnapshot.forEach(doc => {
      milestones.push({ id: doc.id, ...doc.data() });
    });

    res.json({ milestones });
  } catch (error) {
    console.error('❌ Error fetching contributor milestones:', error);
    res.status(500).json({ error: 'Failed to fetch contributor milestones' });
  }
});

// Get milestones by repository
router.get('/repository/:repo', async (req, res) => {
  try {
    const { repo } = req.params;
    const db = getFirestore();
    
    const milestonesSnapshot = await db.collection('milestones')
      .where('repository', '==', repo)
      .orderBy('created_at', 'desc')
      .get();
    
    const milestones = [];
    milestonesSnapshot.forEach(doc => {
      milestones.push({ id: doc.id, ...doc.data() });
    });

    res.json({ milestones });
  } catch (error) {
    console.error('❌ Error fetching repository milestones:', error);
    res.status(500).json({ error: 'Failed to fetch repository milestones' });
  }
});

// Get milestone statistics
router.get('/stats', async (req, res) => {
  try {
    const db = getFirestore();
    
    // Get total milestones
    const milestonesSnapshot = await db.collection('milestones').get();
    const totalMilestones = milestonesSnapshot.size;
    
    // Get unique contributors
    const contributors = new Set();
    milestonesSnapshot.forEach(doc => {
      const data = doc.data();
      contributors.add(data.contributor);
    });
    
    // Get milestone types count
    const milestoneTypes = {};
    milestonesSnapshot.forEach(doc => {
      const data = doc.data();
      const type = data.type;
      milestoneTypes[type] = (milestoneTypes[type] || 0) + 1;
    });

    res.json({
      total_milestones: totalMilestones,
      unique_contributors: contributors.size,
      milestone_types: milestoneTypes
    });
  } catch (error) {
    console.error('❌ Error fetching milestone stats:', error);
    res.status(500).json({ error: 'Failed to fetch milestone statistics' });
  }
});

module.exports = router;
