# Quick Reference: Automated Release

## 🎯 Most Common Command

```bash
npm run prepare-release
```

This is all you need! It will guide you through the release process.

## 📦 What Happens Automatically

### When you run `prepare-release`:
1. ✅ Builds `dist/` from `src/`
2. ✅ Asks you: patch (1.0.1), minor (1.1.0), or major (2.0.0)?
3. ✅ Updates `package.json`
4. ✅ Commits and pushes to GitHub

### Then GitHub Actions automatically:
5. ✅ Creates tag `vX.Y.Z`
6. ✅ Creates GitHub Release
7. ✅ Updates major version tag (`v1`, `v2`, etc.)

## 🚀 Quick Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Build distribution files |
| `npm run check-dist` | Verify dist is up to date |
| `npm run prepare-release` | Interactive release wizard |
| `npm run version:patch` | Quick patch release (1.0.1) |
| `npm run version:minor` | Quick minor release (1.1.0) |
| `npm run version:major` | Quick major release (2.0.0) |

## 🔄 Typical Workflow

```bash
# 1. Make your changes in src/index.js
vim src/index.js

# 2. Test locally if needed
# (no special command, just commit when ready)

# 3. Release!
npm run prepare-release
# Follow the prompts...

# 4. Done! 
# Watch https://github.com/jeffersfp/github-release-slack-notification/actions
```

## ❌ Common Mistakes to Avoid

- ❌ Don't edit `dist/` directly (it's auto-generated)
- ❌ Don't manually create tags (automation does this)
- ❌ Don't forget to commit before releasing
- ❌ Don't bump version without running the script

## ✅ Best Practices

- ✅ Always use `npm run prepare-release`
- ✅ Edit only `src/` directory
- ✅ Commit working changes before releasing
- ✅ Test with a dummy release in another repo first

## 🆘 Troubleshooting

**"You have uncommitted changes"**
```bash
git add .
git commit -m "your changes"
# Then try npm run prepare-release again
```

**"Distribution is out of date"**
```bash
npm run build
git add dist/
git commit -m "chore: rebuild distribution"
git push
```

**Release didn't create automatically**
- Check GitHub Actions: https://github.com/jeffersfp/github-release-slack-notification/actions
- Ensure version in `package.json` changed
- Wait 1-2 minutes for workflow to complete

## 📚 More Details

See [RELEASE.md](RELEASE.md) for comprehensive documentation.
