const core = require('@actions/core');
const github = require('@actions/github');
const { markdownToBlocks } = require('@instantish/mack');
const https = require('https');

function getActionInputs() {
  return {
    slackWebhookUrl: core.getInput('slack-webhook-url'),
    mentions: core.getInput('mentions'),
  }
}

async function formatReleaseBody(body, releaseUrl) {
  if (!body) return [];

  try {
    // Use @instantish/mack to convert markdown to Slack blocks
    const blocks = await markdownToBlocks(body);

    // markdownToBlocks returns an array of blocks
    if (Array.isArray(blocks) && blocks.length > 0) {
      // Check total character count in all blocks
      const totalChars = JSON.stringify(blocks).length;
      const maxLength = 3000;

      if (totalChars > maxLength) {
        // If too long, truncate and add "Read more" link
        return [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: body.substring(0, 2800) + `...\n\n<${releaseUrl}|📖 Read full release notes>`
            }
          }
        ];
      }

      return blocks;
    }
  } catch (error) {
    core.warning(`Failed to convert markdown to blocks: ${error.message}`);
  }

  // Fallback: return simple text block
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: body.length > 2800 ? body.substring(0, 2800) + `...\n\n<${releaseUrl}|📖 Read full release notes>` : body
      }
    }
  ];
}

async function createSlackMessage(inputs, releaseData) {
  const { payload } = github.context;
  const release = payload.release;
  const repository = payload.repository;

  if (!release) {
    throw new Error('No release data found in GitHub context');
  }

  const repoName = repository.name;
  const isPrerelease = release.prerelease;

  const releaseType = isPrerelease ? '🚧 Pre-release' : '🚀 New Release';
  const emoji = isPrerelease ? ':construction:' : ':rocket:';

  // Get the formatted release body blocks
  const releaseBodyBlocks = await formatReleaseBody(release.body, release.html_url);

  // Add divider before release notes
  const dividerBlock = { type: 'divider' };

  const message = {
    text: `${releaseType} Alert: ${repoName} ${release.tag_name}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} ${releaseType}: ${repoName}`,
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `📦 *Version:*\n${release.tag_name}`
          },
          {
            type: 'mrkdwn',
            text: `👤 *Released by:*\n${release.author.login}`
          }
        ]
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `🏷️ *Release Type:*\n${isPrerelease ? 'Pre-release' : 'Stable Release'}`
          },
          {
            type: 'mrkdwn',
            text: `🔗 *Release Notes:*\n<${release.html_url}|View Release Notes>`
          },
        ]
      },
      dividerBlock,
      ...releaseBodyBlocks,
      dividerBlock,
    ]
  };

  // Add mentions if specified
  if (inputs.mentions) {
    const mentionsList = inputs.mentions.split(',').map(id => `<@${id.trim()}>`).join(' ');
    message.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `👥 *Team Notification:* ${mentionsList}`
      }
    });
  }

  return message;
}

function sendSlackMessage(webhookUrl, message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(message);
    const url = new URL(webhookUrl);

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function run() {
  try {
    core.info('🚀 Starting Slack Release Notifier...');

    const inputs = getActionInputs();

    if (!inputs.slackWebhookUrl) {
      core.setFailed('slack-webhook-url input is required');
      return;
    }

    const message = await createSlackMessage(inputs);

    if (!message) {
      core.info('No notification to send');
      core.setOutput('message-sent', 'false');
      return;
    }

    core.info('📝 Sending Slack notification...');
    const response = await sendSlackMessage(inputs.slackWebhookUrl, message);

    core.info('✅ Slack notification sent successfully!');
    core.setOutput('message-sent', 'true');
    core.setOutput('slack-response', response);

  } catch (error) {
    core.error('❌ Error sending Slack notification: ' + error.message);
    core.setFailed(error.message);
  }
}

run();
