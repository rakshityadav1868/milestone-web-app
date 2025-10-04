import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fetchMilestones = async () => {
  try {
    const response = await api.get('/milestones');
    return response.data.milestones || [];
  } catch (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }
};

export const fetchMilestonesByContributor = async (username) => {
  try {
    const response = await api.get(`/milestones/contributor/${username}`);
    return response.data.milestones || [];
  } catch (error) {
    console.error('Error fetching contributor milestones:', error);
    throw error;
  }
};

export const fetchMilestonesByRepository = async (repo) => {
  try {
    const response = await api.get(`/milestones/repository/${repo}`);
    return response.data.milestones || [];
  } catch (error) {
    console.error('Error fetching repository milestones:', error);
    throw error;
  }
};

export const fetchStats = async () => {
  try {
    const response = await api.get('/milestones/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const generateCelebrationPost = async (milestone) => {
  try {
    const response = await api.post('/ai/generate-post', { milestone });
    return response.data.celebration_post;
  } catch (error) {
    console.error('Error generating celebration post:', error);
    throw error;
  }
};

export const generateCustomPost = async (repoName, userName, eventType, count, customPrompt) => {
  try {
    const response = await api.post('/ai/generate-custom', {
      repoName,
      userName,
      eventType,
      count,
      customPrompt
    });
    return response.data.celebration_post;
  } catch (error) {
    console.error('Error generating custom post:', error);
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    const response = await api.get('/webhook/events');
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchRealTimeGitHubStats = async (userId) => {
  try {
    const response = await api.get(`/github/stats/${userId}`);
    return response.data.stats;
  } catch (error) {
    console.error('Error fetching real-time GitHub stats:', error);
    throw error;
  }
};

export default api;
