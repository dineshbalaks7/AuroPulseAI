import axios from 'axios';

/**
 * Resolves the active backend API base URL with priority:
 * 1. Runtime override from localStorage (e.g. user entered their Railway URL)
 * 2. Vite environment variable VITE_API_BASE_URL (set at build time in Vercel/Netlify)
 * 3. Default fallback to http://localhost:8000 for local development
 */
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('AUROPULSE_API_URL');
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }
  }
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() && envUrl !== 'undefined') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:8000';
};

export const setApiBaseUrl = (url) => {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      const clean = url.trim().replace(/\/+$/, '');
      localStorage.setItem('AUROPULSE_API_URL', clean);
      apiClient.defaults.baseURL = clean;
    } else {
      localStorage.removeItem('AUROPULSE_API_URL');
      apiClient.defaults.baseURL = getApiBaseUrl();
    }
  }
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: dynamically ensure the latest baseURL is used
apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata?.startTime;
    response.latency = duration;

    // Detect HTML response masquerading as 200 OK (caused by SPA fallback rewrites when backend is missing)
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE html>') || response.data.includes('<html') || response.data.includes('<!doctype html>'))
    ) {
      const err = new Error(
        `Backend API returned HTML instead of JSON for "${response.config.url}". Your backend URL may be misconfigured.`
      );
      err.isHtmlFallback = true;
      return Promise.reject(err);
    }

    return response;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred while communicating with the backend.';

    if (error.isHtmlFallback) {
      errorMessage = error.message;
    } else if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      const detail = error.response.data?.detail || error.response.data?.message;
      errorMessage = typeof detail === 'string' ? detail : JSON.stringify(detail || error.response.statusText);
    } else if (error.request) {
      // Network error or backend offline
      const currentUrl = getApiBaseUrl();
      errorMessage = `Unable to connect to the Predictive Maintenance API at ${currentUrl}. Please verify the server is online.`;
    } else {
      errorMessage = error.message;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

// Health check endpoint
export const checkApiHealth = async () => {
  try {
    const res = await apiClient.get('/health', { timeout: 5000 });
    // Must be a valid JSON object with status: 'healthy' (not an HTML SPA response)
    if (typeof res.data !== 'object' || !res.data || res.data.status !== 'healthy') {
      return {
        connected: false,
        status: 'offline',
        models: {},
        latency: 0,
        error: 'Invalid response from backend (HTML received instead of JSON)',
      };
    }
    return {
      connected: true,
      status: res.data.status,
      models: res.data.models || {},
      latency: res.latency || 0,
    };
  } catch (err) {
    return {
      connected: false,
      status: 'offline',
      models: {},
      latency: 0,
      error: err.message,
    };
  }
};

export default apiClient;
