# Release Process

This document describes how releases are automated in this project.

## 🎯 Quick Release

To create a new release, simply run:

```bash
npm run prepare-release
```

This interactive script will:
1. Build the distribution files
2. Ask you what type of version bump (patch/minor/major)
3. Update `package.json` with the new version
4. Commit and push the changes
5. Trigger the automated release workflow

## 🤖 Automated Workflow

Once you push a version bump to `main`, GitHub Actions automatically:

1. **Detects version change** in `package.json`
2. **Rebuilds distribution** to ensure it's up to date
3. **Creates a git tag** (e.g., `v1.2.3`)
4. **Creates a GitHub Release** with changelog
5. **Updates major version tag** (e.g., `v1` points to latest `v1.x.x`)

## 📦 Manual Release (Alternative)

If you prefer to release manually:

### Option 1: Using npm version commands

```bash
# For bug fixes
npm run version:patch   # 1.0.0 → 1.0.1

# For new features
npm run version:minor   # 1.0.0 → 1.1.0

# For breaking changes
npm run version:major   # 1.0.0 → 2.0.0
```

### Option 2: Manual steps

```bash
# 1. Build distribution
npm run build

# 2. Update version in package.json manually
# Edit package.json and change version field

# 3. Commit changes
git add package.json dist/
git commit -m "chore: release vX.Y.Z"
git push

# GitHub Actions will handle the rest
```

## 🔍 Verify Distribution is Up to Date

Before committing, check if your distribution is built:

```bash
npm run check-dist
```

This will rebuild and verify that `dist/` matches your source code.

## 🚨 CI/CD Pipeline

### Pull Requests
- Automatically builds distribution
- Verifies `dist/` is up to date
- Validates action metadata

### Main Branch
- **CI workflow**: Validates builds on every push
- **Release workflow**: Creates releases when version changes

## 📋 Versioning Guidelines

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Breaking changes to inputs/outputs/behavior
- **MINOR** version (0.X.0): New features, backward compatible
- **PATCH** version (0.0.X): Bug fixes, backward compatible

## 🏷️ Version Tags

The automation maintains two types of tags:

1. **Specific version**: `v1.2.3` - Points to exact release
2. **Major version**: `v1` - Always points to latest `v1.x.x` (allows users to stay on `v1` automatically)

Users can reference either:
```yaml
uses: jeffersfp/github-release-slack-notification@v1.2.3  # Specific version
uses: jeffersfp/github-release-slack-notification@v1      # Latest v1.x.x
```

## 🔧 Troubleshooting

### Distribution out of sync

If CI fails with "Distribution is out of date":

```bash
npm run build
git add dist/
git commit -m "chore: rebuild distribution"
git push
```

### Release didn't trigger

Ensure that:
1. Version in `package.json` changed
2. Changes were pushed to `main` branch
3. Check GitHub Actions tab for workflow runs

### Need to rebuild a release

Delete the tag and re-push:

```bash
git tag -d v1.2.3
git push origin :refs/tags/v1.2.3
# Update version in package.json and push again
```

## 📚 Files Involved

- `.github/workflows/release.yml` - Automated release workflow
- `.github/workflows/ci.yml` - Build validation workflow  
- `scripts/prepare-release.js` - Interactive release tool
- `package.json` - Version source of truth

## 🎓 Best Practices

1. **Always use the release script** - It ensures consistency
2. **Write meaningful commit messages** - They appear in git history
3. **Test before releasing** - Create a test repo to verify functionality
4. **Document breaking changes** - Update README with migration guides
5. **Keep dist/ in sync** - Never commit without rebuilding
