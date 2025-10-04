#!/usr/bin/env node

const axios = require("axios");

// Test script to fetch real GitHub data
async function testGitHubData() {
  console.log("🔍 Testing GitHub Data Fetching");
  console.log("================================");

  // You need to provide your GitHub username and a personal access token
  const githubUsername = process.argv[2];
  const githubToken = process.argv[3];

  if (!githubUsername || !githubToken) {
    console.log(
      "❌ Usage: node test-github-data.js <github-username> <github-token>"
    );
    console.log("");
    console.log("📝 To get a GitHub token:");
    console.log("1. Go to https://github.com/settings/tokens");
    console.log('2. Click "Generate new token"');
    console.log('3. Select "public_repo" scope');
    console.log("4. Copy the token");
    console.log("");
    console.log(
      "Example: node test-github-data.js yourusername ghp_xxxxxxxxxxxx"
    );
    process.exit(1);
  }

  try {
    console.log(`🚀 Fetching data for: ${githubUsername}`);

    const response = await axios.post(
      "http://localhost:5001/api/github/test-real-data",
      {
        githubUsername,
        githubToken,
      }
    );

    const data = response.data;

    if (data.success) {
      console.log("✅ Success! Here are your real GitHub stats:");
      console.log("");
      console.log("👤 User Info:");
      console.log(`   Name: ${data.user.name || "Not set"}`);
      console.log(`   Username: ${data.user.username}`);
      console.log(`   Public Repositories: ${data.user.publicRepos}`);
      console.log(`   Followers: ${data.user.followers}`);
      console.log(`   Following: ${data.user.following}`);
      console.log("");
      console.log("📊 Statistics:");
      console.log(`   Total Stars: ${data.user.totalStars}`);
      console.log(`   Total Forks: ${data.user.totalForks}`);
      console.log("");
      console.log("📚 Top Repositories:");
      data.repositories
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 5)
        .forEach((repo, index) => {
          console.log(
            `   ${index + 1}. ${repo.name} - ${repo.stars} ⭐ (${
              repo.language || "No language"
            })`
          );
        });

      console.log("");
      console.log("🎉 This is your REAL GitHub data!");
      console.log(
        "Now you can use these credentials in the app to see your actual stats instead of mock data."
      );
    } else {
      console.log("❌ Failed to fetch data:", data.error);
    }
  } catch (error) {
    console.log("💥 Error:", error.response?.data?.message || error.message);

    if (error.response?.status === 401) {
      console.log("");
      console.log("🔑 Authentication failed. Please check:");
      console.log("1. Your GitHub username is correct");
      console.log("2. Your GitHub token is valid");
      console.log('3. Your token has "public_repo" scope');
    }
  }
}

testGitHubData();
