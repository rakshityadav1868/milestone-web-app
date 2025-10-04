import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MilestoneCard from './components/MilestoneCard';
import StatsCard from './components/StatsCard';
import { fetchMilestones, fetchStats } from './services/api';

function App() {
  const [milestones, setMilestones] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [milestonesData, statsData] = await Promise.all([
        fetchMilestones(),
        fetchStats()
      ]);
      
      setMilestones(milestonesData);
      setStats(statsData);
      
      // Show confetti for new milestones (first 3)
      if (milestonesData.length > 0 && milestones.length === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMilestone = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    loadData(); // Refresh data
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading CelebrateHub...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {showConfetti && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        
        <Header onRefresh={loadData} />
        
        <main className="container mx-auto px-4 py-8">
          <Dashboard 
            milestones={milestones}
            stats={stats}
            onNewMilestone={handleNewMilestone}
          />
        </main>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
