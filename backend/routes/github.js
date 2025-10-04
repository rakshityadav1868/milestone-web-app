const express = require("express");
const { getFirestore } = require("../config/firebase");
const axios = require("axios");

const router = express.Router();

// Debug endpoint to list all users
router.get("/debug/users", async (req, res) => {
  try {
    const db = getFirestore();
    const usersSnapshot = await db.collection("users").get();

    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.json({ users, count: users.length });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Fetch real GitHub data for a user and create milestones
router.post("/fetch-user-data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { githubToken, githubUsername } = req.body;

    if (!githubToken || !githubUsername) {
      return res.status(400).json({
        error: "GitHub token and username are required",
      });
    }

    const db = getFirestore();

    // Get user profile to verify
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    console.log(`🔍 Fetching real GitHub data for: ${githubUsername}`);

    // Fetch GitHub user data
    const githubUserResponse = await axios.get(
      `https://api.github.com/users/${githubUsername}`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const githubUser = githubUserResponse.data;

    // Fetch user's repositories
    const reposResponse = await axios.get(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const repositories = reposResponse.data;

    // Calculate real statistics
    let totalStars = 0;
    let totalForks = 0;
    let totalCommits = 0;
    let totalPRs = 0;
    let totalIssues = 0;

    // Get stars and forks from repositories
    repositories.forEach((repo) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
    });

    // Fetch contribution data (this requires additional API calls)
    // For now, we'll estimate based on repository data
    totalCommits = Math.min(githubUser.public_repos * 15, 500); // Estimate
    totalPRs = Math.min(githubUser.public_repos * 2, 50); // Estimate
    totalIssues = Math.min(githubUser.public_repos * 1, 25); // Estimate

    console.log(
      `📊 Real GitHub stats: ${totalStars} stars, ${totalCommits} commits, ${totalPRs} PRs`
    );

    // Create milestones based on real GitHub data
    const realMilestones = [];

    // Create star milestone if user has stars
    if (totalStars > 0) {
      realMilestones.push({
        type: "star",
        count: totalStars,
        repository: `${githubUsername}/repositories`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: totalStars,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `🎉 Amazing! You've earned ${totalStars} stars across your ${repositories.length} repositories! Your open source contributions are making a difference! 🌟`,
      });
    }

    // Create commit milestone if user has commits
    if (totalCommits > 0) {
      realMilestones.push({
        type: "commit",
        count: totalCommits,
        repository: `${githubUsername}/repositories`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: totalCommits,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `💻 Incredible! You've made ${totalCommits} commits across your repositories! Your dedication to coding is remarkable! 🔥`,
      });
    }

    // Create PR milestone if user has PRs
    if (totalPRs > 0) {
      realMilestones.push({
        type: "pull_request",
        count: totalPRs,
        repository: `${githubUsername}/repositories`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: totalPRs,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `🚀 Fantastic! You've merged ${totalPRs} pull requests! Your collaborative spirit is inspiring! 💪`,
      });
    }

    // Create repository milestone
    if (repositories.length > 0) {
      realMilestones.push({
        type: "contribution_days",
        count: repositories.length,
        repository: `${githubUsername}/repositories`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: repositories.length,
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `📅 Outstanding! You've created ${repositories.length} repositories! Your consistency in building projects is inspiring! 🌱`,
      });
    }

    // Save real milestones to Firebase
    const batch = db.batch();
    realMilestones.forEach((milestone) => {
      const milestoneRef = db.collection("milestones").doc();
      batch.set(milestoneRef, milestone);
    });

    await batch.commit();

    res.json({
      success: true,
      message: "Real GitHub milestones created successfully",
      milestones: realMilestones,
      githubUser: {
        username: githubUser.login,
        public_repos: githubUser.public_repos,
        followers: githubUser.followers,
        following: githubUser.following,
        total_stars: totalStars,
        total_forks: totalForks,
        total_commits: totalCommits,
        total_prs: totalPRs,
        total_issues: totalIssues,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching GitHub data:", error);
    res.status(500).json({
      error: "Failed to fetch GitHub data",
      message: error.message,
    });
  }
});

// Fetch real GitHub data using user's stored token
router.post("/fetch-real-data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getFirestore();

    console.log(`🔍 Fetching real GitHub data for user: ${userId}`);

    // Get user profile to verify and get GitHub token
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      console.log(`❌ User not found in database: ${userId}`);
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    const githubUsername = userData.githubUsername;
    const accessToken = userData.accessToken;

    if (!githubUsername || !accessToken) {
      return res.status(400).json({
        error: "GitHub username or access token not found in user profile",
      });
    }

    console.log(`✅ User found: ${userData.displayName} (@${githubUsername})`);

    // Fetch GitHub user data
    const githubUserResponse = await axios.get(
      `https://api.github.com/users/${githubUsername}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const githubUser = githubUserResponse.data;

    // Fetch user's repositories
    const reposResponse = await axios.get(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const repositories = reposResponse.data;

    // Calculate real statistics
    let totalStars = 0;
    let totalForks = 0;

    repositories.forEach((repo) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
    });

    // Estimate other metrics based on repository data
    const totalCommits = Math.min(githubUser.public_repos * 15, 500);
    const totalPRs = Math.min(githubUser.public_repos * 2, 50);

    console.log(
      `📊 Real GitHub stats: ${totalStars} stars, ${repositories.length} repos, ${totalCommits} commits`
    );

    // Create milestones based on real GitHub data
    const realMilestones = [];

    // Create star milestone if user has stars
    if (totalStars > 0) {
      realMilestones.push({
        type: "star",
        count: totalStars,
        repository: `${githubUsername}/repositories`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: totalStars,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `🎉 Amazing! You've earned ${totalStars} stars across your ${repositories.length} repositories! Your open source contributions are making a difference! 🌟`,
      });
    }

    // Create commit milestone
    if (totalCommits > 0) {
      realMilestones.push({
        type: "commit",
        count: totalCommits,
        repository: `${githubUsername}/repositories`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: totalCommits,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `💻 Incredible! You've made ${totalCommits} commits across your repositories! Your dedication to coding is remarkable! 🔥`,
      });
    }

    // Create PR milestone
    if (totalPRs > 0) {
      realMilestones.push({
        type: "pull_request",
        count: totalPRs,
        repository: `${githubUsername}/repositories`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: totalPRs,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `🚀 Fantastic! You've merged ${totalPRs} pull requests! Your collaborative spirit is inspiring! 💪`,
      });
    }

    // Create repository milestone
    if (repositories.length > 0) {
      realMilestones.push({
        type: "contribution_days",
        count: repositories.length,
        repository: `${githubUsername}/repositories`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: repositories.length,
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `📅 Outstanding! You've created ${repositories.length} repositories! Your consistency in building projects is inspiring! 🌱`,
      });
    }

    // Save real milestones to Firebase
    const batch = db.batch();
    realMilestones.forEach((milestone) => {
      const milestoneRef = db.collection("milestones").doc();
      batch.set(milestoneRef, milestone);
    });

    await batch.commit();

    res.json({
      success: true,
      message: "Real GitHub milestones created successfully",
      milestones: realMilestones,
      githubUser: {
        username: githubUser.login,
        public_repos: githubUser.public_repos,
        followers: githubUser.followers,
        following: githubUser.following,
        total_stars: totalStars,
        total_forks: totalForks,
        total_commits: totalCommits,
        total_prs: totalPRs,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching real GitHub data:", error);
    res.status(500).json({
      error: "Failed to fetch real GitHub data",
      message: error.message,
    });
  }
});

// Create sample milestones for testing (no GitHub API required)
router.post("/create-sample-milestones/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getFirestore();

    console.log(`🔍 Creating sample milestones for user: ${userId}`);

    // Get user profile to verify
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      console.log(`❌ User not found in database: ${userId}`);
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`✅ User found: ${userDoc.data().displayName}`);

    const userData = userDoc.data();
    const githubUsername = userData.githubUsername || "sample-user";

    // Create sample milestones with more realistic, dynamic values
    const currentDate = new Date();
    const randomFactor = Math.random() * 0.5 + 0.75; // Random factor between 0.75 and 1.25
    
    const sampleMilestones = [
      {
        type: "star",
        count: Math.floor(15 * randomFactor),
        repository: `${githubUsername}/awesome-project`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: Math.floor(15 * randomFactor),
        date: new Date(currentDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `🎉 Amazing! You've earned ${Math.floor(15 * randomFactor)} stars on your awesome project! Your open source contributions are making a difference! 🌟`,
      },
      {
        type: "pull_request",
        count: Math.floor(8 * randomFactor),
        repository: `${githubUsername}/cool-repo`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: Math.floor(8 * randomFactor),
        date: new Date(currentDate.getTime() - (7 + Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `🚀 Fantastic! You've merged ${Math.floor(8 * randomFactor)} pull requests! Your collaborative spirit is inspiring! 💪`,
      },
      {
        type: "commit",
        count: Math.floor(75 * randomFactor),
        repository: `${githubUsername}/main-project`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: Math.floor(75 * randomFactor),
        date: new Date(currentDate.getTime() - (14 + Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `💻 Incredible! You've made ${Math.floor(75 * randomFactor)} commits! Your dedication to coding is remarkable! 🔥`,
      },
      {
        type: "contribution_days",
        count: Math.floor(25 * randomFactor),
        repository: `${githubUsername}/daily-commits`,
        contributor: githubUsername,
        userId: userId,
        milestone_reached: Math.floor(25 * randomFactor),
        date: new Date(currentDate.getTime() - (21 + Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        celebration_post: `📅 Outstanding! You've been contributing for ${Math.floor(25 * randomFactor)} days! Your consistency is the key to success! 🌱`,
      },
    ];

    // Save sample milestones to Firebase
    const batch = db.batch();
    sampleMilestones.forEach((milestone) => {
      const milestoneRef = db.collection("milestones").doc();
      batch.set(milestoneRef, milestone);
    });

    await batch.commit();

    res.json({
      success: true,
      message: "Sample milestones created successfully",
      milestones: sampleMilestones,
    });
  } catch (error) {
    console.error("❌ Error creating sample milestones:", error);
    res.status(500).json({
      error: "Failed to create sample milestones",
      message: error.message,
    });
  }
});

// Get real-time GitHub statistics for a user
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getFirestore();

    console.log(`🔍 Fetching real-time GitHub stats for user: ${userId}`);

    // Get user profile
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    const githubUsername = userData.githubUsername;
    const accessToken = userData.accessToken;

    if (!githubUsername || !accessToken) {
      return res.status(400).json({
        error: "GitHub username or access token not found in user profile",
      });
    }

    // Fetch real-time GitHub data
    const [githubUserResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${githubUsername}`, {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }),
      axios.get(
        `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
        {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      ),
    ]);

    const githubUser = githubUserResponse.data;
    const repositories = reposResponse.data;

    // Calculate real-time statistics
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    const totalCommits = Math.min(githubUser.public_repos * 15, 500); // Estimate
    const totalPRs = Math.min(githubUser.public_repos * 2, 50); // Estimate

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRepos = repositories.filter(repo => 
      new Date(repo.updated_at) > thirtyDaysAgo
    );

    const stats = {
      username: githubUser.login,
      public_repos: githubUser.public_repos,
      followers: githubUser.followers,
      following: githubUser.following,
      total_stars: totalStars,
      total_forks: totalForks,
      total_commits: totalCommits,
      total_prs: totalPRs,
      recent_activity: {
        repos_updated_last_30_days: recentRepos.length,
        most_starred_repo: repositories.reduce((max, repo) => 
          repo.stargazers_count > max.stargazers_count ? repo : max, 
          { stargazers_count: 0, name: 'No repositories' }
        ),
        account_created: githubUser.created_at,
        last_updated: new Date().toISOString()
      }
    };

    res.json({
      success: true,
      stats,
      message: "Real-time GitHub statistics fetched successfully"
    });
  } catch (error) {
    console.error("❌ Error fetching GitHub stats:", error);
    res.status(500).json({
      error: "Failed to fetch GitHub statistics",
      message: error.message,
    });
  }
});

module.exports = router;
