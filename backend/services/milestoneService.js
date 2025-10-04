const { getFirestore } = require("../config/firebase");
const { generateCelebrationPost } = require("./aiService");

// Milestone thresholds
const MILESTONE_THRESHOLDS = {
  pull_request: [1, 5, 10, 25, 50, 100],
  star: [1, 10, 25, 50, 100, 500, 1000],
  issue: [1, 5, 10, 25, 50],
  commit: [10, 50, 100, 500, 1000],
  contribution_days: [7, 30, 90, 180, 365],
};

const detectMilestone = async (event, eventType) => {
  try {
    const db = getFirestore();
    const repoName = event.repository?.full_name || "unknown";
    const contributor = event.sender?.login || "unknown";

    if (!repoName || !contributor) {
      return null;
    }

    // Try to find the Firebase user ID for this GitHub contributor
    let userId = null;
    try {
      const usersSnapshot = await db
        .collection("users")
        .where("githubUsername", "==", contributor)
        .limit(1)
        .get();

      if (!usersSnapshot.empty) {
        userId = usersSnapshot.docs[0].id;
      }
    } catch (error) {
      console.warn(
        "Could not find Firebase user for GitHub contributor:",
        contributor
      );
    }

    // Get current counts for this contributor in this repo
    const contributorRef = db
      .collection("contributor_stats")
      .doc(`${repoName}_${contributor}`);

    const contributorDoc = await contributorRef.get();
    let currentStats = contributorDoc.exists
      ? contributorDoc.data()
      : {
          pull_requests: 0,
          stars: 0,
          issues: 0,
          commits: 0,
          contribution_days: new Set(),
        };

    // Update stats based on event type
    let milestone = null;

    switch (eventType) {
      case "pull_request":
        if (event.action === "closed" && event.pull_request?.merged) {
          currentStats.pull_requests = (currentStats.pull_requests || 0) + 1;
          milestone = checkMilestone(
            "pull_request",
            currentStats.pull_requests,
            repoName,
            contributor,
            userId
          );
        }
        break;

      case "star":
        if (event.action === "created") {
          currentStats.stars = (currentStats.stars || 0) + 1;
          milestone = checkMilestone(
            "star",
            currentStats.stars,
            repoName,
            contributor,
            userId
          );
        }
        break;

      case "issues":
        if (event.action === "opened") {
          currentStats.issues = (currentStats.issues || 0) + 1;
          milestone = checkMilestone(
            "issue",
            currentStats.issues,
            repoName,
            contributor,
            userId
          );
        }
        break;

      case "push":
        if (event.commits && event.commits.length > 0) {
          currentStats.commits =
            (currentStats.commits || 0) + event.commits.length;
          milestone = checkMilestone(
            "commit",
            currentStats.commits,
            repoName,
            contributor,
            userId
          );
        }
        break;
    }

    // Update contribution days
    if (eventType === "push" || eventType === "pull_request") {
      const today = new Date().toISOString().split("T")[0];
      if (!currentStats.contribution_days) {
        currentStats.contribution_days = new Set();
      }
      currentStats.contribution_days.add(today);

      // Check contribution day milestones
      if (!milestone) {
        const contributionCount = currentStats.contribution_days.size;
        milestone = checkMilestone(
          "contribution_days",
          contributionCount,
          repoName,
          contributor,
          userId
        );
      }
    }

    // Save updated stats
    await contributorRef.set({
      ...currentStats,
      contribution_days: Array.from(currentStats.contribution_days || []),
      last_updated: new Date().toISOString(),
    });

    return milestone;
  } catch (error) {
    console.error("❌ Error detecting milestone:", error);
    return null;
  }
};

const checkMilestone = (
  eventType,
  count,
  repoName,
  contributor,
  userId = null
) => {
  const thresholds = MILESTONE_THRESHOLDS[eventType] || [];

  for (const threshold of thresholds) {
    if (count === threshold) {
      return {
        type: eventType,
        count: count,
        repository: repoName,
        contributor: contributor,
        userId: userId, // Include Firebase user ID
        milestone_reached: threshold,
      };
    }
  }

  return null;
};

module.exports = {
  detectMilestone,
  checkMilestone,
};
