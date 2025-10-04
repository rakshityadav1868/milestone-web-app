import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Github,
  Sparkles,
  Star,
  GitPullRequest,
  Bug,
  GitCommit,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const LandingPage = () => {
  const { user, signInWithGitHub, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(true);
  const navigate = useNavigate();

  // Check Firebase configuration status
  useEffect(() => {
    const checkFirebaseConfig = () => {
      // Since we're using hardcoded Firebase config, it should always be configured
      setIsFirebaseConfigured(true);
    };
    
    checkFirebaseConfig();
  }, []);

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleGetStarted = async () => {
    // Prevent multiple clicks
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      if (user) {
        // User is already logged in, redirect to dashboard
        navigate("/dashboard");
      } else {
        // User is not logged in, trigger GitHub login
        await signInWithGitHub();
        // After successful login, useEffect will handle the redirect
      }
    } catch (error) {
      console.error("Get Started failed:", error);
      // Error message is already shown in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const floatingIcons = [
    { Icon: Star, delay: 0, x: 20, y: 20 },
    { Icon: GitPullRequest, delay: 0.5, x: -30, y: 40 },
    { Icon: Bug, delay: 1, x: 40, y: -20 },
    { Icon: GitCommit, delay: 1.5, x: -20, y: -30 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Floating GitHub icons */}
        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            className="absolute text-white/10"
            style={{
              left: `${50 + x}%`,
              top: `${50 + y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: delay,
            }}
          >
            <Icon size={40} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span className="text-white/90 font-medium">
                  Celebrate Every Contribution!
                </span>
              </motion.div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="block"
              >
                CelebrateHub
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Recognize milestones and moments from your GitHub journey. Every
              contribution deserves celebration! 🎉
            </motion.p>

            {/* Firebase Configuration Warning */}
            {!isFirebaseConfigured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2 text-yellow-200">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Demo Mode</span>
                </div>
                <p className="text-yellow-100 text-sm mt-2">
                  Firebase authentication is not configured. To use GitHub login, please set up your Firebase credentials. 
                  Check the <code className="bg-yellow-500/20 px-1 rounded">FIREBASE_SETUP.md</code> file for instructions.
                </p>
              </motion.div>
            )}

            {/* Get Started Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              whileHover={{ scale: isFirebaseConfigured ? 1.05 : 1, y: isFirebaseConfigured ? -2 : 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              disabled={isLoading || authLoading || !isFirebaseConfigured}
              className={`group relative inline-flex items-center space-x-3 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${
                isFirebaseConfigured 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-blue-500/25" 
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Github className="h-6 w-6" />
                  <span>{isFirebaseConfigured ? "Get Started" : "Setup Required"}</span>
                  {isFirebaseConfigured && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </>
              )}

              {/* Glow effect */}
              {isFirebaseConfigured && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              )}
            </motion.button>

            {/* Additional CTA for GitHub Login */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-6"
            >
              <p className="text-white/60 text-sm mb-4">
                {isFirebaseConfigured 
                  ? "Sign in with GitHub to access your personalized dashboard"
                  : "Configure Firebase to enable GitHub authentication"
                }
              </p>
              <motion.button
                whileHover={{ scale: isFirebaseConfigured ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetStarted}
                disabled={isLoading || authLoading || !isFirebaseConfigured}
                className={`inline-flex items-center space-x-2 backdrop-blur-sm font-medium px-6 py-3 rounded-full text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFirebaseConfigured 
                    ? "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40" 
                    : "bg-gray-600/20 text-gray-400 border border-gray-600/20 cursor-not-allowed"
                }`}
              >
                <Github className="h-4 w-4" />
                <span>{isFirebaseConfigured ? "Continue with GitHub" : "Setup Required"}</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Star,
                title: "Track Stars",
                description: "Celebrate every star your repos receive",
              },
              {
                icon: GitPullRequest,
                title: "PR Milestones",
                description: "Recognize your contribution journey",
              },
              {
                icon: Bug,
                title: "Issue Resolution",
                description: "Acknowledge your problem-solving skills",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <feature.icon className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;