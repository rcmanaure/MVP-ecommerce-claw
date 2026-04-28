# Ecommerce MVP — Project Rules

## Confirmed by Boss — 2026-04-28

### 1. Docker Mandatory
- All components must run in Docker
- Scruffy owns Docker infrastructure
- Current: app + db + nginx via docker-compose ✅

### 2. QA Testing Required (Fry)
- Every delivery must be tested by Fry before merge
- Fry owns: test plans, test execution, bug reports
- Process: Builder → Hermes → Fry QA → Merge

### 3. GitHub Integration Required
- Create repository
- Setup CI/CD pipeline
- Branch strategy: feature/* → develop → main
- Credentials needed from Boss

## Current Status

| Rule | Status | Owner |
|------|--------|-------|
| Docker | ✅ Infrastructure ready | Scruffy |
| QA Testing | ⏳ Fry not yet assigned | Fry |
| GitHub | ⏳ Awaiting credentials | Boss |

## QA Task Template (for Fry)
When assigning QA:
- Builder: [Name]
- Deliverable: [What was built]
- Test scope: [What to test]
- Artifacts: [Where files are]
- Pass criteria: [Definition of done]

## GitHub Setup Required
- [ ] Boss provides GitHub credentials/token
- [ ] Create repo: ecommerce-mvp (Hermes/Scruffy only)
- [ ] Setup GitHub Actions CI/CD
- [ ] Branch protection rules
- [ ] Merge requirements (CI + 1 approval + Fry QA sign-off)

## GitHub Access Rules (Boss - 2026-04-28)
- **Allowed repos:** Only repos created by Bender, Hermes, or Scruffy
- **Forbidden:** Any other repo without explicit Boss authorization
- **Scope:** CI/CD pipeline, branches, merges for ecommerce-mvp only
- **Enforcement:** ALL agents must comply — this rule applies to every agent in the team

---
*Last updated: 2026-04-28 15:01 UTC-4*
*Hermes — Orchestrator*