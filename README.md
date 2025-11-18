# 🚀 GitHub Release Slack Notification

[![GitHub release](https://img.shields.io/github/v/release/jeffersfp/github-release-slack-notification?color=95B83B)](https://github.com/jeffersfp/github-release-slack-notification/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Automated Slack notifications for GitHub releases - perfect for teams and SDK announcements. This GitHub Action sends beautifully formatted Slack messages when you publish a new release, keeping your team instantly informed.

## ✨ Features

- 🎨 **Rich Slack formatting** with blocks and markdown support
- 📝 **Automatic markdown conversion** from release notes to Slack format
- 🏷️ **Pre-release support** with visual indicators
- 👥 **Team mentions** to notify specific users
- ⚡ **Zero configuration** - works out of the box
- 🔗 **Direct links** to release notes and repository
- 📦 **Smart truncation** for long release notes

## 📋 Prerequisites

You'll need a Slack Webhook URL. To create one:

1. Go to [Slack API](https://api.slack.com/apps)
2. Create a new app or select an existing one
3. Navigate to **Incoming Webhooks** and activate it
4. Click **Add New Webhook to Workspace**
5. Select the channel where notifications should be posted
6. Copy the webhook URL

## 🚀 Usage

### Basic Example

```yaml
name: Release Notifications

on:
  release:
    types: [published]

jobs:
  notify-slack:
    runs-on: ubuntu-latest
    steps:
      - name: Send Slack Notification
        uses: jeffersfp/github-release-slack-notification@v0.1.1
        with:
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Advanced Example with Mentions

```yaml
name: Release Notifications

on:
  release:
    types: [published, created]

jobs:
  notify-slack:
    runs-on: ubuntu-latest
    steps:
      - name: Send Slack Notification
        uses: jeffersfp/github-release-slack-notification@v0.1.1
        with:
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          mentions: 'U1234567890,U0987654321'
```

### Without Changelog

```yaml
name: Release Notifications

on:
  release:
    types: [published]

jobs:
  notify-slack:
    runs-on: ubuntu-latest
    steps:
      - name: Send Slack Notification
        uses: jeffersfp/github-release-slack-notification@v0.1.1
        with:
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          include-changelog: 'false'
```

## ⚙️ Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `slack-webhook-url` | Slack webhook URL for sending notifications | ✅ Yes | - |
| `include-changelog` | Whether to include the release changelog in the message | ❌ No | `true` |
| `mentions` | Comma-separated list of Slack user IDs to mention | ❌ No | - |

### Getting Slack User IDs

To mention users, you need their Slack user ID (not username):

1. In Slack, click on a user's profile
2. Click **More** (three dots)
3. Select **Copy member ID**
4. Use the ID in the format: `U1234567890`

You can specify multiple users: `U1234567890,U0987654321,U1122334455`

## 📤 Outputs

| Output | Description |
|--------|-------------|
| `message-sent` | Whether the message was sent successfully (`true` or `false`) |
| `slack-response` | Response from Slack API |

## 📝 Message Format

The action sends a rich, formatted message including:

- 🏷️ Release type (Stable or Pre-release)
- 📦 Version/tag name
- 👤 Release author
- 📅 Publication date
- 🔗 Links to release notes and repository
- 📄 Formatted release body (converted from markdown)
- 👥 Optional team mentions

### Example Message Preview

```
🚀 New Release: my-awesome-project

📦 Version: v1.2.0
👤 Released by: jeffersfp
📅 Published on: 11/14/2025, 2:30:45 PM

🏷️ Release Type: Stable Release
🔗 Release Notes: View Release Notes
🔗 Repository: owner/my-awesome-project

────────────────────────────────

## What's New
- Added new feature X
- Fixed bug Y
- Improved performance

────────────────────────────────

👥 Team Notification: @john @jane
```

## 🔒 Security

**Important:** Never commit your Slack webhook URL directly in your workflow file. Always use GitHub Secrets:

1. Go to your repository **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `SLACK_WEBHOOK_URL`
4. Value: Your webhook URL
5. Reference it as `${{ secrets.SLACK_WEBHOOK_URL }}`

## 🛠️ Development

### Building from Source

```bash
# Install dependencies
npm install

# Build the action
npm run build

# Verify distribution is up to date
npm run check-dist
```

### Making a Release

We use an automated release process. Simply run:

```bash
npm run prepare-release
```

This interactive tool will:
- Build distribution files
- Prompt for version bump type (patch/minor/major)
- Commit and push changes
- Trigger automated release via GitHub Actions

For more details, see [RELEASE.md](RELEASE.md).

### Project Structure

```
├── .github/workflows/   # CI/CD automation
├── action.yaml          # Action metadata
├── src/
│   └── index.js        # Main action code
├── dist/
│   └── index.js        # Bundled distribution
├── scripts/
│   └── prepare-release.js  # Release automation
├── examples/
│   └── workflow.yaml   # Example workflow
└── package.json        # Node.js dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Contributor Guidelines

1. **Fork and clone** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** in `src/` (not `dist/`)
4. **Build distribution**: `npm run build`
5. **Commit**: `git commit -m 'feat: add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

The CI workflow will automatically verify your changes build correctly.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [@actions/core](https://github.com/actions/toolkit/tree/main/packages/core) and [@actions/github](https://github.com/actions/toolkit/tree/main/packages/github)
- Markdown conversion powered by [@instantish/mack](https://github.com/instantish/mack)

## 📊 Support

If you find this action helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 💡 Suggesting new features
- 🔀 Contributing code improvements
