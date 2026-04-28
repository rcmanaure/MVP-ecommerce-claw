# GitHub Setup Guide

## Branch Protection Rules

### Main Branch
- **Require pull request reviews before merging**: Enabled (1 approval required)
- **Require status checks to pass before merging**: Enabled
  - Required checks: `build-and-test` (must pass)
- **Dismiss stale reviews**: Enabled
- **Require branches to be up to date before merging**: Enabled
- **Restrict who can push to main**: Enabled
  - Allowed: maintainers only

### Develop Branch
- **Require pull request reviews**: Enabled (1 approval)
- **Require status checks**: Enabled
- **Allow force pushes**: Disabled
- **Allow deletions**: Disabled

### Feature Branches (`feature/*`)
- **Require status checks**: Optional (encouraged)
- **Auto-delete after merge**: Enabled

## Workflows

### CI Pipeline (`.github/workflows/ci.yml`)
- Runs on: Node.js 20
- Jobs:
  1. `build-and-test`: Installs deps, generates Prisma client, runs Jest tests, builds
  2. `docker-build`: Builds Docker images (only on main/develop, after tests pass)

### Trunk-Based Development
- Short-lived feature branches
- Merge to `develop` for integration
- Merge to `main` for release

## Repository Settings (Manual)

1. Go to Settings → Branches → Add rule
2. Apply rules per above
3. Enable "Require organizations members to pass MFA"
