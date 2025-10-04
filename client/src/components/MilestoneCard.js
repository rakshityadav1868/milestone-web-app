import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Star, 
  Bug, 
  GitCommit, 
  Calendar,
  Copy,
  Share2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateCelebrationPost } from '../services/api';
import InteractiveCard3D from './InteractiveCard3D';

const MilestoneCard = ({ milestone, onNewMilestone }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState(milestone.celebration_post || '');

  const getEventIcon = (type) => {
    const icons = {
      pull_request: <GitPullRequest className="h-5 w-5" />,
      star: <Star className="h-5 w-5" />,
      issue: <Bug className="h-5 w-5" />,
      commit: <GitCommit className="h-5 w-5" />,
      contribution_days: <Calendar className="h-5 w-5" />
    };
    return icons[type] || <Sparkles className="h-5 w-5" />;
  };

  const getEventColor = (type) => {
    const colors = {
      pull_request: 'text-blue-600 bg-blue-50',
      star: 'text-yellow-600 bg-yellow-50',
      issue: 'text-red-600 bg-red-50',
      commit: 'text-green-600 bg-green-50',
      contribution_days: 'text-purple-600 bg-purple-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopyPost = async () => {
    try {
      let postToCopy = generatedPost;
      
      if (!postToCopy) {
        setIsGenerating(true);
        postToCopy = await generateCelebrationPost(milestone);
        setGeneratedPost(postToCopy);
      }
      
      await navigator.clipboard.writeText(postToCopy);
      toast.success('Celebration post copied to clipboard!');
    } catch (error) {
      console.error('Error copying post:', error);
      toast.error('Failed to copy post');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      let postToShare = generatedPost;
      
      if (!postToShare) {
        setIsGenerating(true);
        postToShare = await generateCelebrationPost(milestone);
        setGeneratedPost(postToShare);
      }
      
      const shareData = {
        title: `Milestone Achievement in ${milestone.repository}`,
        text: postToShare,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(postToShare);
        toast.success('Post copied to clipboard for sharing!');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <InteractiveCard3D
      className="milestone-card group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-md transition-all duration-500 ease-out transform-gpu"
      maxTilt={12}
      scaleOnHover={1.03}
      perspective={1200}
      shadowIntensity={0.25}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getEventColor(milestone.type)}`}>
            {getEventIcon(milestone.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {milestone.type.replace('_', ' ')} Milestone
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {milestone.count} {milestone.type.replace('_', ' ')}
              {milestone.count !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(milestone.created_at)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {milestone.contributor}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              in {milestone.repository}
            </p>
          </div>
        </div>

        {generatedPost && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
              "{generatedPost}"
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex space-x-2">
            <button
              onClick={handleCopyPost}
              disabled={isGenerating}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              <Copy className="h-3 w-3" />
              <span>{isGenerating ? 'Generating...' : 'Copy'}</span>
            </button>
            
            <button
              onClick={handleShare}
              disabled={isGenerating}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              <Share2 className="h-3 w-3" />
              <span>Share</span>
            </button>
          </div>
          
          <a
            href={`https://github.com/${milestone.repository}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors duration-200"
          >
            <ExternalLink className="h-3 w-3" />
            <span>View Repo</span>
          </a>
        </div>
      </div>
    </InteractiveCard3D>
  );
};

export default MilestoneCard;
