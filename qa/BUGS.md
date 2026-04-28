# Bug Report: Auth Module QA

**Date:** 2026-04-28
**Tester:** Fry (QA Engineer)
**Total Bugs Found:** 2
**Critical:** 2 | High: 0 | Medium: 0 | Low: 0

---

## Bug #1: Docker Build Failure — Missing package.json

**Title:** Docker build fails due to missing package.json in project root

**Severity:** Critical

**Steps to reproduce:**
1. Navigate to `/mnt/Storage3/ecommerce-deployment/docker/`
2. Run `docker compose up -d`
3. Observe build failure

**Expected:** Docker image builds successfully, containers start

**Actual:**
```
npm error The `npm ci` command can only install with an existing package-lock.json
Run npm install to generate a package-lock.json file, then try again.
failed to solve: process "/bin/sh -c npm ci --only=production" did not complete successfully: exit code: 1
```

**Root Cause:**
- Dockerfile at `docker/Dockerfile` uses `COPY package*.json ./` expecting files in build context root
- Build context is `..` (project root: `/mnt/Storage3/ecommerce-deployment/`)
- No `package.json` or `package-lock.json` exists in project root
- Backend code is in `src/` subdirectory, not at project root

**Evidence:**
```
$ ls /mnt/Storage3/ecommerce-deployment/
ARCHITECTURE.md  config  data  docker  frontend  logs  prisma  src  ...

$ cat /mnt/Storage3/ecommerce-deployment/src/package.json
cat: /mnt/Storage3/ecommerce-deployment/src/package.json: No such file or directory
```

**Workaround:** None — backend cannot start without fixing build

**Fix Required:**
1. Create `/mnt/Storage3/ecommerce-deployment/package.json` with all dependencies
2. Run `npm install` to generate `package-lock.json`
3. Update Dockerfile if needed to reference correct paths

---

## Bug #2: Frontend Mock Auth Service — No Backend Integration

**Title:** Frontend auth service uses mock functions, cannot connect to real API

**Severity:** Critical

**Steps to reproduce:**
1. Start frontend dev server
2. Open Login page in browser
3. Enter credentials and submit
4. Observe: No actual API call to backend

**Expected:** Login form submits to `POST /api/auth/login`, receives JWT token, sets httpOnly cookie

**Actual:** `frontend/src/services/auth.js` uses mock functions with `mockDelay()`:
```javascript
export async function login(email, password, rememberMe = false) {
  await mockDelay(800);
  console.log(`[Mock Auth] Login: ${email}`);
  return { user: { id: '1', email, name: email.split('@')[0] }, expiresIn: 86400 };
}
```

**Evidence:**
- File: `/mnt/Storage3/ecommerce-deployment/frontend/src/services/auth.js`
- All functions (`login`, `register`, `logout`, `forgotPassword`, `resetPassword`, `getCurrentUser`) are mocks
- No `fetch()` or `axios` calls to backend
- No httpOnly cookie handling
- No token storage

**Impact:**
- Frontend cannot authenticate against real backend
- No session management
- All auth flows are broken in production mode
- User registration/login/etc. do not work end-to-end

**Workaround:** None — frontend needs complete auth service rewrite

**Fix Required:**
1. Replace mock functions with real API calls using `fetch()` or `axios`
2. Handle httpOnly cookies for refresh tokens
3. Implement proper error handling for network failures
4. Add JWT token management (access token in memory, refresh in httpOnly cookie)

---

## Summary

| # | Bug | Severity | Blocked Testing |
|---|-----|----------|-----------------|
| 1 | Docker build fails - missing package.json | Critical | Yes - Backend cannot start |
| 2 | Frontend mock auth service | Critical | Yes - UI cannot communicate with API |

**Both bugs must be fixed before auth module testing can resume.**

---

**Reporter:** Fry (QA Engineer)
**Report Date:** 2026-04-28
**Report Location:** `/mnt/Storage3/ecommerce-deployment/qa/BUGS.md`