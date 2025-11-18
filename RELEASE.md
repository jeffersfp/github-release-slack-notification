# Release Guide

## Creating a New Release

Run the interactive release script:

```bash
npm run prepare-release
```

This will:
1. Build the distribution
2. Prompt you for version type (patch/minor/major)
3. Update version in `package.json`, `README.md`, and examples
4. Commit and push changes
5. Trigger GitHub Actions to create the release

## What Happens Automatically

GitHub Actions detects the version change and:
- Creates git tag (e.g., `v1.2.3`)
- Creates GitHub Release
- Updates major version tag (e.g., `v1` → latest `v1.x.x`)

## Versioning

Follow [Semantic Versioning](https://semver.org/):
- **PATCH**: Bug fixes, backward compatible
- **MINOR**: New features, backward compatible
- **MAJOR**: Breaking changes

### Quick Commands for version bumping

The commands below can be used directly to bump versions, but using the interactive script is recommended:

```bash
npm run version:patch   # 1.0.0 → 1.0.1 (bug fixes)
npm run version:minor   # 1.0.0 → 1.1.0 (new features)
npm run version:major   # 1.0.0 → 2.0.0 (breaking changes)
```

## Troubleshooting

**Distribution out of sync:**
```bash
npm run build
git add dist/
git commit -m "chore: rebuild distribution"
git push
```

**Release didn't trigger:**
- Verify version changed in `package.json`
- Check [GitHub Actions](https://github.com/jeffersfp/github-release-slack-notification/actions)
- Wait 1-2 minutes for workflow to complete
