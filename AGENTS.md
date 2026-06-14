# AGENTS.md — github-release-slack-notification

## What this is

A JavaScript GitHub Action that posts formatted Slack messages when a GitHub release is published. Single-entrypoint: `src/index.js` → bundled via `@vercel/ncc` → `dist/index.js` (the runtime entry in `action.yaml`).

## Build & verify

```bash
npm run build          # ncc bundles src/index.js → dist/ with source map
npm run check-dist     # build + assert dist/ is clean (CI gate)
npm run prepare-release # interactive: bump version, build, commit, push
```

Only `src/` and `package.json` are edited by hand. Never edit `dist/` directly — it is a build artifact. The pre-commit hook (`.githooks/pre-commit`) auto-rebuilds `dist/` when `src/` or `package.json` change.

## History

- The `include-changelog` input had a casing mismatch (`includeChangelog` vs `includeChangeLog`) that made the condition always falsy, and `action.yaml` defaulted to `'false'` despite the README claiming `true`. Both were fixed in a single change: property reference corrected and default flipped to `'true'`.

## No tests exist

There is no test framework, test directory, or test script. There is no linter or formatter. Verification is manual or via CI (which only checks `dist/` is up to date and `action.yaml` exists).

## CI & release flow

- **CI** (`.github/workflows/ci.yml`): runs on PRs/pushes to `main` — `npm ci`, `npm run build`, then asserts `git diff --quiet dist/`.
- **Release** (`.github/workflows/release.yml`): on push to `main` touching `src/`, `action.yaml`, `package.json`, or `README.md` — if `package.json` version changed, it creates a git tag, GitHub Release, and updates the major-version tag.
- Releases are triggered by the `prepare-release.js` script, not manual tag pushes.
- **Dependabot**: weekly npm dependency updates.

## Environment

- Node 24 (enforced by `package.json` engines and `mise.toml`).
- `@vercel/ncc` is in `dependencies` (not `devDependencies`) — this is normal for GitHub Actions that need to self-bundle.
- No dev dependencies at all.
- No TypeScript, no ESLint, no Prettier.

## Action inputs (from `action.yaml`)

| Input | Required | Default |
|---|---|---|
| `slack-webhook-url` | yes | — |
| `include-changelog` | no | `'false'` |
| `mentions` | no | — |

## Architecture notes

- `src/index.js` is the sole source file. It reads GitHub context via `@actions/github`, converts release body markdown to Slack blocks via `@instantish/mack`, and POSTs to the webhook URL using Node's built-in `https` module (no `node-fetch` / `axios`).
- Owns all its dependencies — no external runtime besides Node.
- The repo URL in `package.json` (`github-release-notification`, missing "slack") and `homepage` are wrong but harmless.
