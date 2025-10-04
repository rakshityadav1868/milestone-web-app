const axios = require('axios');

const sendToWebhook = async (milestone, celebrationPost) => {
  const webhooks = [];
  
  if (process.env.SLACK_WEBHOOK_URL) {
    webhooks.push(sendToSlack(milestone, celebrationPost));
  }
  
  if (process.env.DISCORD_WEBHOOK_URL) {
    webhooks.push(sendToDiscord(milestone, celebrationPost));
  }
  
  if (webhooks.length === 0) {
    console.log('📝 No webhook URLs configured');
    return;
  }
  
  try {
    await Promise.all(webhooks);
    console.log('✅ Successfully sent to webhooks');
  } catch (error) {
    console.error('❌ Error sending to webhooks:', error);
  }
};

const sendToSlack = async (milestone, celebrationPost) => {
  try {
    const { repository, contributor, type, count } = milestone;
    
    const slackMessage = {
      text: celebrationPost,
      attachments: [
        {
          color: "good",
          fields: [
            {
              title: "Repository",
              value: repository,
              short: true
            },
            {
              title: "Contributor",
              value: contributor,
              short: true
            },
            {
              title: "Milestone",
              value: `${count} ${type.replace('_', ' ')}`,
              short: true
            }
          ],
          footer: "CelebrateHub",
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    };
    
    await axios.post(process.env.SLACK_WEBHOOK_URL, slackMessage);
    console.log('📤 Sent to Slack');
  } catch (error) {
    console.error('❌ Error sending to Slack:', error);
    throw error;
  }
};

const sendToDiscord = async (milestone, celebrationPost) => {
  try {
    const { repository, contributor, type, count } = milestone;
    
    const discordMessage = {
      content: celebrationPost,
      embeds: [
        {
          title: "🎉 New Milestone Achieved!",
          color: 0x00ff00,
          fields: [
            {
              name: "Repository",
              value: repository,
              inline: true
            },
            {
              name: "Contributor",
              value: contributor,
              inline: true
            },
            {
              name: "Milestone",
              value: `${count} ${type.replace('_', ' ')}`,
              inline: true
            }
          ],
          footer: {
            text: "CelebrateHub"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    await axios.post(process.env.DISCORD_WEBHOOK_URL, discordMessage);
    console.log('📤 Sent to Discord');
  } catch (error) {
    console.error('❌ Error sending to Discord:', error);
    throw error;
  }
};

module.exports = {
  sendToWebhook,
  sendToSlack,
  sendToDiscord
};
