# 🧪 Testing Your Release Automation

Before pushing the automation to production, test it!

## 🎯 Quick Test Plan

### 1. Test Pre-commit Hook

```bash
# Make a change in src/
echo "// test comment" >> src/index.js

# Commit (should auto-build)
git add src/index.js
git commit -m "test: verify pre-commit hook"

# Check if dist/ was automatically updated
git status
# Should see "nothing to commit, working tree clean"
```

### 2. Test Release Script Locally

```bash
# Ensure you have clean working directory
git status

# Run the release script (but cancel before pushing)
npm run prepare-release
# Choose "patch"
# When prompted to continue, type "n" to cancel

# Verify it built correctly
npm run check-dist
```

### 3. Test CI Workflow (Non-Destructive)

```bash
# Create a test branch
git checkout -b test-automation

# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "test: ci workflow"
git push origin test-automation

# Open PR on GitHub and watch CI run
# https://github.com/jeffersfp/github-release-slack-notification/pulls
```

### 4. Test Full Release (In a Test Repo)

To test the complete release flow safely:

1. **Fork or create a test repository**
2. **Copy these automation files:**
   ```bash
   .github/workflows/
   scripts/
   ```
3. **Run a test release there first**
4. **Verify the workflow creates tags and releases**

## 🔍 What to Verify

### ✅ Pre-commit Hook Works
- [ ] Changes in `src/` trigger auto-build
- [ ] `dist/` is updated automatically
- [ ] Commit includes both `src/` and `dist/`

### ✅ CI Workflow Works  
- [ ] Runs on every push to main
- [ ] Runs on every pull request
- [ ] Fails if `dist/` is out of sync
- [ ] Passes when everything is correct

### ✅ Release Workflow Works
- [ ] Triggers only when version in `package.json` changes
- [ ] Creates proper git tag (e.g., `v1.2.3`)
- [ ] Creates GitHub release
- [ ] Updates major version tag (e.g., `v1`)
- [ ] Includes changelog in release notes

### ✅ Release Script Works
- [ ] Detects uncommitted changes
- [ ] Builds distribution
- [ ] Prompts for version type
- [ ] Updates `package.json`
- [ ] Commits and pushes correctly
- [ ] Provides clear status messages

## 🚨 Common Test Failures

### "Distribution out of sync" in CI
**Cause:** Changed `src/` but didn't rebuild `dist/`  
**Fix:** 
```bash
npm run build
git add dist/
git commit -m "chore: rebuild distribution"
git push
```

### Release workflow didn't trigger
**Cause:** Version in `package.json` didn't change  
**Fix:** The workflow only triggers when version changes. Make sure you bumped the version.

### Pre-commit hook not running
**Cause:** Git hooks not configured  
**Fix:**
```bash
git config core.hooksPath .githooks
```

## 🎓 Test Scenarios

### Scenario 1: Bug Fix Release
```bash
# 1. Fix a bug in src/
vim src/index.js

# 2. Commit changes
git add src/index.js
git commit -m "fix: resolve Slack message formatting"
git push

# 3. Create patch release
npm run prepare-release
# Choose: 1 (patch)

# 4. Verify at: https://github.com/YOUR_REPO/actions
```

### Scenario 2: New Feature Release
```bash
# 1. Add feature in src/
vim src/index.js

# 2. Update README
vim README.md

# 3. Commit all changes
git add src/ README.md
git commit -m "feat: add support for custom message templates"
git push

# 4. Create minor release
npm run prepare-release
# Choose: 2 (minor)
```

### Scenario 3: Rollback a Release
```bash
# If you need to undo a release:

# 1. Delete the tag locally
git tag -d v1.2.3

# 2. Delete the tag remotely
git push origin :refs/tags/v1.2.3

# 3. Delete the GitHub release (on GitHub web)

# 4. Reset version in package.json
vim package.json  # Change version back

# 5. Commit and push
git add package.json
git commit -m "chore: rollback release"
git push
```

## 📊 Success Criteria

Your automation is working perfectly when:

✅ You can make changes and commit without thinking about `dist/`  
✅ CI catches any issues before merge  
✅ Releases happen automatically when you bump version  
✅ Tags are created correctly  
✅ GitHub releases include proper changelogs  
✅ Major version tags (v1, v2) stay up to date  
✅ Contributors can work without knowing the build process  

## 🎉 Ready to Go!

Once all tests pass, you're ready to use the automation in production:

```bash
# Commit the automation files
git add .
git commit -m "chore: add release automation and testing"
git push

# Create your first automated release!
npm run prepare-release
```

---

**Need help?** Check [AUTOMATION_SUMMARY.md](AUTOMATION_SUMMARY.md) or [RELEASE.md](RELEASE.md)
