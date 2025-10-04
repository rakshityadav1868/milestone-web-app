const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateCelebrationPost = async (milestone, customPrompt = null) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OpenAI API key not configured, using fallback message');
      return generateFallbackMessage(milestone);
    }

    const { repository, contributor, type, count } = milestone;
    
    const prompt = customPrompt || `
Generate a short, fun, and professional celebration post for this GitHub milestone:

Repository: ${repository}
Contributor: ${contributor}
Event Type: ${type}
Milestone: ${count}

Requirements:
- Keep it under 250 characters
- Make it energetic and celebratory
- Professional but fun tone
- Include relevant emojis
- Mention the specific achievement
- Suitable for LinkedIn, Discord, or Slack

Generate a single celebration post that captures the excitement of this achievement.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a social media expert who creates engaging, celebratory posts for developer achievements. Keep responses concise, fun, and professional."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.8
    });

    const celebrationPost = completion.choices[0]?.message?.content?.trim();
    
    if (!celebrationPost) {
      throw new Error('Failed to generate celebration post');
    }

    return celebrationPost;
  } catch (error) {
    console.error('❌ Error generating AI celebration post:', error);
    return generateFallbackMessage(milestone);
  }
};

const generateFallbackMessage = (milestone) => {
  const { repository, contributor, type, count } = milestone;
  
  const emojis = {
    pull_request: '🚀',
    star: '⭐',
    issue: '🐛',
    commit: '💻',
    contribution_days: '📅'
  };
  
  const messages = {
    pull_request: `🎉 Amazing! ${contributor} just merged their ${count}${count === 1 ? 'st' : count === 2 ? 'nd' : count === 3 ? 'rd' : 'th'} PR in ${repository}! ${emojis.pull_request}`,
    star: `🌟 Incredible! ${repository} just hit ${count} stars! Thanks to the amazing community! ${emojis.star}`,
    issue: `🐛 Great work! ${contributor} opened their ${count}${count === 1 ? 'st' : count === 2 ? 'nd' : count === 3 ? 'rd' : 'th'} issue in ${repository}! ${emojis.issue}`,
    commit: `💻 Awesome! ${contributor} just made their ${count}${count === 1 ? 'st' : count === 2 ? 'nd' : count === 3 ? 'rd' : 'th'} commit in ${repository}! ${emojis.commit}`,
    contribution_days: `📅 Fantastic! ${contributor} has been contributing to ${repository} for ${count} days straight! ${emojis.contribution_days}`
  };
  
  return messages[type] || `🎉 Congratulations to ${contributor} for reaching ${count} ${type} in ${repository}! 🎉`;
};

module.exports = {
  generateCelebrationPost,
  generateFallbackMessage
};
