# Git Hooks

This directory contains Git hooks to help maintain code quality.

## Pre-commit Hook

The `pre-commit` hook automatically:
- Detects changes in `src/` or `package.json`
- Rebuilds `dist/` if needed
- Stages the rebuilt files
- Ensures distribution is always in sync

## Setup

To enable Git hooks, run:

```bash
git config core.hooksPath .githooks
```

Or add this to your project setup:

```bash
# In package.json scripts
"postinstall": "git config core.hooksPath .githooks"
```

## Manual Build

If you prefer to build manually, you don't need to enable hooks. Just remember to run:

```bash
npm run build
```

before committing changes to `src/`.
