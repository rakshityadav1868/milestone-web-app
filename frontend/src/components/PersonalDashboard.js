import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  GitPullRequest,
  Bug,
  GitCommit,
  Calendar,
  Share2,
  LogOut,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import InteractiveBackground from "./InteractiveBackground";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Confetti from "react-confetti";
import { fetchRealTimeGitHubStats } from "../services/api";

const PersonalDashboard = () => {
  const { user, userProfile, logout } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [githubStats, setGithubStats] = useState(null);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen to real-time milestone updates
  useEffect(() => {
    if (!user || !db) return;

    const q = query(
      collection(db, "milestones"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMilestones = [];
      snapshot.forEach((doc) => {
        newMilestones.push({ id: doc.id, ...doc.data() });
      });

      // Check if there are new milestones (trigger confetti)
      if (newMilestones.length > milestones.length && milestones.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      // Sort milestones by created_at date (newest first)
      const sortedMilestones = newMilestones.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setMilestones(sortedMilestones);
    });

    return unsubscribe;
  }, [user, milestones.length]); // Remove db from dependencies as it's a stable reference

  // Define refreshGitHubStats function first
  const refreshGitHubStats = useCallback(async () => {
    if (!user) {
      console.log("❌ No user found, cannot refresh GitHub stats");
      return;
    }
    
    console.log("🔄 Starting GitHub stats refresh for user:", user.uid);
    setIsRefreshingStats(true);
    
    try {
      const stats = await fetchRealTimeGitHubStats(user.uid);
      console.log("✅ GitHub stats received:", stats);
      setGithubStats(stats);
    } catch (error) {
      console.error("❌ Error refreshing GitHub stats:", error);
      // Show user-friendly error message
      alert(`Failed to refresh GitHub stats: ${error.message || 'Unknown error'}`);
    } finally {
      setIsRefreshingStats(false);
      console.log("🔄 GitHub stats refresh completed");
    }
  }, [user]);

  // Fetch real-time GitHub stats when component mounts
  useEffect(() => {
    if (user) {
      refreshGitHubStats();
    }
  }, [user, refreshGitHubStats]);

  // Auto-refresh GitHub stats every 5 minutes
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshGitHubStats();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user, refreshGitHubStats]);

  const getMilestoneIcon = (type) => {
    const icons = {
      star: Star,
      pull_request: GitPullRequest,
      issue: Bug,
      commit: GitCommit,
      contribution_days: Calendar,
    };
    return icons[type] || Trophy;
  };

  const getMilestoneColor = (type) => {
    const colors = {
      star: "from-yellow-400 to-orange-500",
      pull_request: "from-blue-400 to-blue-600",
      issue: "from-red-400 to-red-600",
      commit: "from-green-400 to-green-600",
      contribution_days: "from-purple-400 to-purple-600",
    };
    return colors[type] || "from-gray-400 to-gray-600";
  };

  const generateLinkedInPost = (milestone) => {
    const messages = {
      star: `🎉 Proud moment! Just hit ${milestone.count} stars on my GitHub repository! Grateful to the amazing community for the support! 💪 #OpenSource #GitHub #CelebrateHub`,
      pull_request: `🚀 Excited to share that I've just merged my ${
        milestone.count
      }${
        milestone.count === 1
          ? "st"
          : milestone.count === 2
          ? "nd"
          : milestone.count === 3
          ? "rd"
          : "th"
      } pull request! Every contribution counts in the open source journey! 💻 #OpenSource #GitHub #CelebrateHub`,
      issue: `🐛 Just closed my ${milestone.count}${
        milestone.count === 1
          ? "st"
          : milestone.count === 2
          ? "nd"
          : milestone.count === 3
          ? "rd"
          : "th"
      } issue! Problem-solving is at the heart of development! 🔧 #OpenSource #GitHub #CelebrateHub`,
      commit: `💻 Milestone achieved! Just made my ${milestone.count}${
        milestone.count === 1
          ? "st"
          : milestone.count === 2
          ? "nd"
          : milestone.count === 3
          ? "rd"
          : "th"
      } commit! Every line of code matters! 🚀 #OpenSource #GitHub #CelebrateHub`,
      contribution_days: `📅 Amazing! I've been contributing to open source for ${milestone.count} consecutive days! Consistency is key to growth! 🌱 #OpenSource #GitHub #CelebrateHub`,
    };
    return (
      messages[milestone.type] ||
      `🎉 Just achieved a new milestone: ${milestone.count} ${milestone.type}! #OpenSource #GitHub #CelebrateHub`
    );
  };

  const shareToLinkedIn = (milestone) => {
    const post = generateLinkedInPost(milestone);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}&summary=${encodeURIComponent(post)}`;
    window.open(linkedInUrl, "_blank");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const createSampleMilestones = async () => {
    try {
      console.log("🚀 Creating sample milestones for user:", user.uid);
      const response = await fetch(
        `/api/github/create-sample-milestones/${user.uid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Sample milestones created:", result);
        // The real-time listener will automatically update the milestones
      } else {
        const errorData = await response.json();
        console.error("❌ Failed to create sample milestones:", errorData);
      }
    } catch (error) {
      console.error("💥 Error creating sample milestones:", error);
    }
  };

  const fetchRealGitHubData = async () => {
    try {
      console.log("🚀 Fetching real GitHub data for user:", user.uid);
      const response = await fetch(`/api/github/fetch-real-data/${user.uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Real GitHub data fetched:", result);
        // The real-time listener will automatically update the milestones
      } else {
        const errorData = await response.json();
        console.error("❌ Failed to fetch real GitHub data:", errorData);
      }
    } catch (error) {
      console.error("💥 Error fetching real GitHub data:", error);
    }
  };

  // Debug authentication state
  console.log("🔍 Auth state:", {
    user: !!user,
    userProfile: !!userProfile,
    userUid: user?.uid,
  });

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading your dashboard...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {!user ? "Please sign in with GitHub" : "Loading your profile..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={userProfile.photoURL || user.photoURL}
                alt={userProfile.displayName || user.displayName}
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {userProfile.displayName || user.displayName}!
                  👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  @{userProfile.githubUsername || "github-user"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log("🔄 Refresh Stats button clicked");
                  refreshGitHubStats();
                }}
                disabled={isRefreshingStats}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors duration-200"
              >
                <TrendingUp className={`h-4 w-4 ${isRefreshingStats ? 'animate-spin' : ''}`} />
                <span>{isRefreshingStats ? 'Refreshing...' : 'Refresh Stats'}</span>
              </motion.button>
              
              {milestones.length === 0 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchRealGitHubData}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Star className="h-4 w-4" />
                    <span>Fetch Real GitHub Data</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createSampleMilestones}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Create Sample Data</span>
                  </motion.button>
                </>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Milestones",
              value: milestones.length,
              icon: Trophy,
              color: "text-yellow-600",
              bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
              subtitle: "Achievement milestones"
            },
            {
              title: "This Month",
              value: milestones.filter((m) => {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return new Date(m.created_at) > monthAgo;
              }).length,
              icon: TrendingUp,
              color: "text-green-600",
              bgColor: "bg-green-50 dark:bg-green-900/20",
              subtitle: "Recent achievements"
            },
            {
              title: githubStats ? "Live GitHub Stars" : "Stars Earned",
              value: githubStats ? githubStats.total_stars : milestones
                .filter((m) => m.type === "star")
                .reduce((sum, m) => sum + m.count, 0),
              icon: Star,
              color: "text-orange-600",
              bgColor: "bg-orange-50 dark:bg-orange-900/20",
              subtitle: githubStats ? "Real-time from GitHub" : "From milestones"
            },
            {
              title: githubStats ? "Live GitHub PRs" : "PRs Merged",
              value: githubStats ? githubStats.total_prs : milestones
                .filter((m) => m.type === "pull_request")
                .reduce((sum, m) => sum + m.count, 0),
              icon: GitPullRequest,
              color: "text-blue-600",
              bgColor: "bg-blue-50 dark:bg-blue-900/20",
              subtitle: githubStats ? "Real-time from GitHub" : "From milestones"
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div
                className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-4`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {stat.subtitle}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Real-time GitHub Stats Section */}
        {githubStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-8 border border-purple-200 dark:border-purple-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Live GitHub Statistics
              </h2>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <span>Last updated: {new Date(githubStats.recent_activity.last_updated).toLocaleTimeString()}</span>
                {isRefreshingStats && (
                  <TrendingUp className="h-3 w-3 ml-2 animate-spin text-purple-600" />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {githubStats.public_repos}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Public Repos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {githubStats.followers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {githubStats.following}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {githubStats.recent_activity.repos_updated_last_30_days}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Repos (30d)</div>
              </div>
            </div>
            
            {githubStats.recent_activity.most_starred_repo.stargazers_count > 0 && (
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Most Starred Repository:</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {githubStats.recent_activity.most_starred_repo.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  {githubStats.recent_activity.most_starred_repo.stargazers_count} stars
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Milestones Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Your Achievement Timeline
          </h2>

          <AnimatePresence>
            {milestones.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Trophy className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No milestones yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start contributing to see your achievements here! Or fetch
                  your real GitHub data or create sample data to see how the
                  dashboard works.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchRealGitHubData}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Star className="h-5 w-5" />
                    <span>Fetch Real GitHub Data</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createSampleMilestones}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Trophy className="h-5 w-5" />
                    <span>Create Sample Data</span>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {milestones.map((milestone, index) => {
                  const Icon = getMilestoneIcon(milestone.type);
                  const gradientClass = getMilestoneColor(milestone.type);

                  return (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-3 rounded-full bg-gradient-to-r ${gradientClass}`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {milestone.count}{" "}
                              {milestone.type.replace("_", " ")} milestone
                              reached!
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(
                                milestone.created_at
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => shareToLinkedIn(milestone)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Share on LinkedIn</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default PersonalDashboard;
