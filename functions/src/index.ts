import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { createHmac, timingSafeEqual } from "crypto";
import axios from "axios";

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Milestone thresholds
const MILESTONE_THRESHOLDS = {
  pull_request: [1, 5, 10, 25, 50, 100],
  star: [1, 10, 25, 50, 100, 500, 1000],
  issue: [1, 5, 10, 25, 50],
  commit: [10, 50, 100, 500, 1000],
  contribution_days: [7, 30, 90, 180, 365],
};

// GitHub webhook listener
export const githubWebhook = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-GitHub-Event, X-GitHub-Delivery, X-Hub-Signature-256"
  );

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const eventType = req.headers["x-github-event"];
    const signature = req.headers["x-hub-signature-256"];
    const payload = req.body;

    console.log(`📥 Received ${eventType} event from GitHub`);

    // Verify webhook signature (optional but recommended)
    // const webhookSecret = functions.config().github.webhook_secret;
    // if (webhookSecret && !verifySignature(payload, signature, webhookSecret)) {
    //   res.status(401).send('Unauthorized');
    //   return;
    // }

    // Store the event in Firestore
    const eventData = {
      type: eventType,
      action: payload.action || "unknown",
      repository: {
        name: payload.repository?.name || "unknown",
        full_name: payload.repository?.full_name || "unknown",
        owner: payload.repository?.owner?.login || "unknown",
      },
      sender: {
        login: payload.sender?.login || "unknown",
        avatar_url: payload.sender?.avatar_url || "",
      },
      timestamp: new Date().toISOString(),
      raw_data: payload,
    };

    await db.collection("events").add(eventData);

    // Check for milestones
    const milestone = await detectMilestone(payload, eventType);

    if (milestone) {
      console.log(
        `🎉 Milestone detected: ${milestone.type} - ${milestone.count}`
      );

      // Save milestone to Firestore
      const milestoneData = {
        ...milestone,
        created_at: new Date().toISOString(),
      };

      await db.collection("milestones").add(milestoneData);

      res.json({
        success: true,
        milestone: milestone,
        message: "Milestone detected and saved",
      });
    } else {
      res.json({
        success: true,
        message: "Event processed, no milestone reached",
      });
    }
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).json({
      error: "Failed to process webhook",
      message: error.message,
    });
  }
});

// Milestone detection logic
async function detectMilestone(event: any, eventType: string) {
  try {
    const repoName = event.repository?.full_name || "unknown";
    const contributor = event.sender?.login || "unknown";

    if (!repoName || !contributor) {
      return null;
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
          contribution_days: [],
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
            contributor
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
            contributor
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
            contributor
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
            contributor
          );
        }
        break;
    }

    // Update contribution days
    if (eventType === "push" || eventType === "pull_request") {
      const today = new Date().toISOString().split("T")[0];
      if (!currentStats.contribution_days) {
        currentStats.contribution_days = [];
      }
      if (!currentStats.contribution_days.includes(today)) {
        currentStats.contribution_days.push(today);
      }

      // Check contribution day milestones
      if (!milestone) {
        const contributionCount = currentStats.contribution_days.length;
        milestone = checkMilestone(
          "contribution_days",
          contributionCount,
          repoName,
          contributor
        );
      }
    }

    // Save updated stats
    await contributorRef.set({
      ...currentStats,
      last_updated: new Date().toISOString(),
    });

    return milestone;
  } catch (error) {
    console.error("❌ Error detecting milestone:", error);
    return null;
  }
}

function checkMilestone(
  eventType: string,
  count: number,
  repoName: string,
  contributor: string
) {
  const thresholds =
    MILESTONE_THRESHOLDS[eventType as keyof typeof MILESTONE_THRESHOLDS] || [];

  for (const threshold of thresholds) {
    if (count === threshold) {
      return {
        type: eventType,
        count: count,
        repository: repoName,
        contributor: contributor,
        userId: contributor, // This should be mapped to actual user ID
        date: new Date().toISOString(),
        milestone_reached: threshold,
      };
    }
  }

  return null;
}

// Function to verify GitHub webhook signature
function verifySignature(
  payload: any,
  signature: string,
  secret: string
): boolean {
  const expectedSignature =
    "sha256=" +
    createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex");

  return timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Function to get user milestones
export const getUserMilestones = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const userId = context.auth.uid;

    try {
      const milestonesSnapshot = await db
        .collection("milestones")
        .where("userId", "==", userId)
        .orderBy("date", "desc")
        .get();

      const milestones = [];
      milestonesSnapshot.forEach((doc) => {
        milestones.push({ id: doc.id, ...doc.data() });
      });

      return { milestones };
    } catch (error) {
      console.error("Error fetching user milestones:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to fetch milestones"
      );
    }
  }
);
