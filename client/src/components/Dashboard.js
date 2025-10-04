import React, { useState } from 'react';
import { TrendingUp, Users, Award, Calendar } from 'lucide-react';
import MilestoneCard from './MilestoneCard';
import StatsCard from './StatsCard';
import FilterBar from './FilterBar';
import Card3DDemo from './Card3DDemo';

const Dashboard = ({ milestones, stats, onNewMilestone }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showDemo, setShowDemo] = useState(false);

  const filteredMilestones = milestones.filter(milestone => {
    if (filter === 'all') return true;
    if (filter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(milestone.created_at) > weekAgo;
    }
    return milestone.type === filter;
  });

  const sortedMilestones = [...filteredMilestones].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    }
    if (sortBy === 'count') {
      return b.count - a.count;
    }
    return 0;
  });

  const statCards = [
    {
      title: 'Total Milestones',
      value: stats?.total_milestones || 0,
      icon: Award,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      title: 'Contributors',
      value: stats?.unique_contributors || 0,
      icon: Users,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      title: 'This Week',
      value: milestones.filter(m => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(m.created_at) > weekAgo;
      }).length,
      icon: TrendingUp,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      title: 'Active Repos',
      value: new Set(milestones.map(m => m.repository)).size,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* 3D Cards Demo Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span>{showDemo ? 'Hide' : 'Show'} 3D Cards Demo</span>
          <TrendingUp className="h-4 w-4" />
        </button>
      </div>

      {/* 3D Cards Demo */}
      {showDemo && <Card3DDemo />}

      {/* Filter and Sort Controls */}
      <FilterBar 
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalMilestones={milestones.length}
        filteredCount={filteredMilestones.length}
      />

      {/* Milestones Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Recent Milestones
            {filteredMilestones.length !== milestones.length && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({filteredMilestones.length} of {milestones.length})
              </span>
            )}
          </h2>
        </div>

        {sortedMilestones.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No milestones found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' 
                ? "No milestones have been recorded yet. Set up your GitHub webhook to start tracking!"
                : "No milestones match your current filter. Try adjusting your filters."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMilestones.map((milestone, index) => (
              <MilestoneCard 
                key={milestone.id || index} 
                milestone={milestone}
                onNewMilestone={onNewMilestone}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
