// server/index-main.js - Main mode without external API dependencies

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://celebratehub.vercel.app"]
        : ["http://localhost:3000"],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data for main mode
const mockMilestones = [
  {
    id: "1",
    type: "pull_request",
    count: 10,
    repository: "test/repo",
    contributor: "testuser",
    celebration_post:
      "🎉 Amazing! testuser just merged their 10th PR in test/repo! 🚀",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    type: "star",
    count: 100,
    repository: "test/repo",
    contributor: "testuser",
    celebration_post:
      "🌟 Incredible! test/repo just hit 100 stars! Thanks to the amazing community! ⭐",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    type: "commit",
    count: 50,
    repository: "awesome-project",
    contributor: "developer123",
    celebration_post:
      "💻 Fantastic! developer123 just made their 50th commit to awesome-project! Keep coding! 🎯",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "4",
    type: "issue",
    count: 25,
    repository: "open-source-lib",
    contributor: "contributor456",
    celebration_post:
      "🐛 Outstanding! contributor456 just closed their 25th issue in open-source-lib! Problem solver! 🔧",
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "5",
    type: "star",
    count: 500,
    repository: "popular-tool",
    contributor: "maintainer789",
    celebration_post:
      "⭐ Phenomenal! popular-tool just reached 500 stars! The community loves this project! 🌟",
    created_at: new Date(Date.now() - 345600000).toISOString(),
  },
];

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "CelebrateHub API (Main Mode)",
    features: {
      github_integration: true,
      ai_posts: "fallback_mode",
      firebase: "not_configured",
      real_time: true,
    },
  });
});

// Milestones endpoints
app.get("/api/milestones", (req, res) => {
  res.json({ milestones: mockMilestones });
});

app.get("/api/milestones/stats", (req, res) => {
  const uniqueContributors = [
    ...new Set(mockMilestones.map((m) => m.contributor)),
  ];
  const milestoneTypes = mockMilestones.reduce((acc, milestone) => {
    acc[milestone.type] = (acc[milestone.type] || 0) + 1;
    return acc;
  }, {});

  res.json({
    total_milestones: mockMilestones.length,
    unique_contributors: uniqueContributors.length,
    milestone_types: milestoneTypes,
  });
});

app.get("/api/milestones/contributor/:username", (req, res) => {
  const { username } = req.params;
  const userMilestones = mockMilestones.filter(
    (m) => m.contributor === username
  );
  res.json({ milestones: userMilestones });
});

app.get("/api/milestones/repository/*", (req, res) => {
  const repo = req.params[0];
  const repoMilestones = mockMilestones.filter((m) => m.repository === repo);
  res.json({ milestones: repoMilestones });
});

// Webhook endpoints
app.get("/api/webhook/events", (req, res) => {
  res.json({ events: [] });
});

app.post("/api/webhook", (req, res) => {
  console.log("📥 Received webhook:", req.headers["x-github-event"]);
  res.json({ success: true, message: "Webhook received (main mode)" });
});

// AI endpoints with fallback
app.post("/api/ai/generate-post", (req, res) => {
  const { milestone } = req.body;
  const celebrationPost = `🎉 Congratulations to ${milestone.contributor} for reaching ${milestone.count} ${milestone.type} in ${milestone.repository}! 🎉`;
  res.json({ success: true, celebration_post: celebrationPost });
});

app.post("/api/ai/generate-custom", (req, res) => {
  const { repoName, userName, eventType, count, customPrompt } = req.body;
  const celebrationPost = `🎉 ${userName} achieved ${count} ${eventType} in ${repoName}! ${
    customPrompt || "Amazing work!"
  } 🎉`;
  res.json({ success: true, celebration_post: celebrationPost });
});

// GitHub integration endpoints
app.post("/api/github/test-real-data", async (req, res) => {
  try {
    const { githubUsername, githubToken } = req.body;

    if (!githubUsername || !githubToken) {
      return res.status(400).json({
        success: false,
        error: "githubUsername and githubToken are required",
      });
    }

    console.log("🔍 Testing real GitHub data for:", githubUsername);

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

    repositories.forEach((repo) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
    });

    res.json({
      success: true,
      message: "Real GitHub data fetched successfully",
      user: {
        username: githubUser.login,
        name: githubUser.name,
        publicRepos: githubUser.public_repos,
        followers: githubUser.followers,
        following: githubUser.following,
        totalStars,
        totalForks,
      },
      repositories: repositories.map((repo) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching GitHub data:", error.message);
    res.status(400).json({
      success: false,
      error: "Failed to fetch GitHub data",
      message: error.message,
    });
  }
});

app.post("/api/github/fetch-real-data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { githubUsername, githubToken } = req.body;

    console.log("📥 Fetching GitHub data for user:", userId);

    // If GitHub credentials are provided, fetch real data
    if (githubUsername && githubToken) {
      console.log("🔍 Fetching real GitHub data for:", githubUsername);

      try {
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

        repositories.forEach((repo) => {
          totalStars += repo.stargazers_count;
          totalForks += repo.forks_count;
        });

        // Create real milestones based on actual data
        const realMilestones = [];

        // Add star milestone if user has stars
        if (totalStars > 0) {
          realMilestones.push({
            id: "real-stars",
            type: "star",
            count: totalStars,
            repository: "All Repositories",
            contributor: githubUsername,
            celebration_post: `🌟 Amazing! ${githubUsername} has ${totalStars} total stars across all repositories! ⭐`,
            created_at: new Date().toISOString(),
          });
        }

        // Add repository milestone
        if (githubUser.public_repos > 0) {
          realMilestones.push({
            id: "real-repos",
            type: "repository",
            count: githubUser.public_repos,
            repository: "All Repositories",
            contributor: githubUsername,
            celebration_post: `📚 Fantastic! ${githubUsername} has ${githubUser.public_repos} public repositories! 🚀`,
            created_at: new Date().toISOString(),
          });
        }

        // Add follower milestone
        if (githubUser.followers > 0) {
          realMilestones.push({
            id: "real-followers",
            type: "follower",
            count: githubUser.followers,
            repository: "GitHub Profile",
            contributor: githubUsername,
            celebration_post: `👥 Incredible! ${githubUsername} has ${githubUser.followers} followers! 🎉`,
            created_at: new Date().toISOString(),
          });
        }

        // Add fork milestone
        if (totalForks > 0) {
          realMilestones.push({
            id: "real-forks",
            type: "fork",
            count: totalForks,
            repository: "All Repositories",
            contributor: githubUsername,
            celebration_post: `🍴 Outstanding! ${githubUsername}'s repositories have been forked ${totalForks} times! 🔥`,
            created_at: new Date().toISOString(),
          });
        }

        console.log("✅ Real GitHub data fetched successfully");
        res.json({
          success: true,
          message: "Real GitHub data fetched successfully",
          milestones: realMilestones,
          stats: {
            totalStars,
            totalForks,
            publicRepos: githubUser.public_repos,
            followers: githubUser.followers,
            following: githubUser.following,
          },
        });
      } catch (githubError) {
        console.error("❌ Error fetching GitHub data:", githubError.message);
        res.status(400).json({
          success: false,
          error: "Failed to fetch GitHub data",
          message: githubError.message,
        });
      }
    } else {
      // Fallback to mock data if no GitHub credentials
      console.log("📝 No GitHub credentials provided, using mock data");
      res.json({
        success: true,
        message:
          "Main mode - using mock data (provide githubUsername and githubToken for real data)",
        milestones: mockMilestones,
      });
    }
  } catch (error) {
    console.error("💥 Error in fetch-real-data endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 CelebrateHub server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔧 Main Mode: Full features with fallbacks`);
  console.log(`✨ Features:`);
  console.log(`   • GitHub Integration: ✅ Enabled`);
  console.log(`   • AI Posts: ⚠️  Fallback mode (no OpenAI key)`);
  console.log(`   • Real-time Data: ✅ Enabled`);
  console.log(`   • Firebase: ⚠️  Not configured`);
});
