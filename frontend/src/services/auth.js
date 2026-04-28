/**
 * Auth Service — Real API calls with httpOnly cookies
 * Production: JWT access token stored in memory, refresh token in httpOnly cookie
 */

const API_BASE = '/api/auth';

// In-memory access token (NOT localStorage)
let accessToken = null;

/**
 * Get current access token
 */
export function getAccessToken() {
  return accessToken;
}

/**
 * Set access token
 */
function setAccessToken(token) {
  accessToken = token;
}

/**
 * Clear access token (on logout or refresh failure)
 */
function clearAccessToken() {
  accessToken = null;
}

/**
 * API fetch wrapper with consistent error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Required for httpOnly cookies
    ...options,
  };

  // Attach access token if we have one and it's not already set
  if (accessToken && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized — try refresh
    if (response.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // Retry original request with new token
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        const retryResponse = await fetch(url, config);
        return handleResponse(retryResponse);
      } else {
        // Refresh failed — redirect to login
        redirectToLogin();
        throw new Error('Session expired. Please login again.');
      }
    }

    return handleResponse(response);
  } catch (error) {
    if (error.message === 'Session expired. Please login again.') {
      throw error;
    }
    throw new Error('Unable to connect. Please try again.');
  }
}

/**
 * Handle API response — parse JSON, handle errors
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || 'Something went wrong. Please try again.';
    const code = data?.error?.code || 'UNKNOWN_ERROR';
    
    const error = new Error(message);
    error.code = code;
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Try to refresh the access token using httpOnly cookie
 */
async function tryRefreshToken() {
  try {
    const response = await fetch(`${API_BASE}/refresh`, {
      method: 'POST',
      credentials: 'include', // Send httpOnly cookie
    });

    if (!response.ok) {
      clearAccessToken();
      return false;
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    return true;
  } catch (error) {
    clearAccessToken();
    return false;
  }
}

/**
 * Redirect to login page
 */
function redirectToLogin() {
  clearAccessToken();
  window.location.href = '/login';
}

// --------------------------------------------
// Auth API Functions
// --------------------------------------------

/**
 * Login user
 * POST /api/auth/login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: Object, accessToken: string}>}
 */
export async function login(email, password) {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Store access token in memory
  if (data.accessToken) {
    setAccessToken(data.accessToken);
  }

  return data;
}

/**
 * Register new user
 * POST /api/auth/register
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: Object, accessToken: string}>}
 */
export async function register(email, password) {
  const data = await apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Store access token in memory
  if (data.accessToken) {
    setAccessToken(data.accessToken);
  }

  return data;
}

/**
 * Get current user
 * GET /api/auth/me
 * @returns {Promise<{user: Object}>}
 */
export async function getCurrentUser() {
  return apiFetch('/me');
}

/**
 * Logout
 * POST /api/auth/logout
 */
export async function logout() {
  try {
    await apiFetch('/logout', {
      method: 'POST',
    });
  } finally {
    clearAccessToken();
  }
}

/**
 * Request password reset
 * POST /api/auth/forgot-password
 * @param {string} email
 * @returns {Promise<{message: string}>}
 */
export async function forgotPassword(email) {
  return apiFetch('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Reset password with token
 * POST /api/auth/reset-password
 * @param {string} token
 * @param {string} password
 * @returns {Promise<{message: string}>}
 */
export async function resetPassword(token, password) {
  return apiFetch('/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

/**
 * Check if user is authenticated (has valid access token)
 */
export function isAuthenticated() {
  return accessToken !== null;
}
