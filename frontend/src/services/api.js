import axios from 'axios';

// Support VITE_API_BASE_URL or fallback to relative proxy / direct 8000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Inject custom headers or timestamps if needed
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
    return response;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred while communicating with the backend.';

    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      const detail = error.response.data?.detail || error.response.data?.message;
      errorMessage = typeof detail === 'string' ? detail : JSON.stringify(detail || error.response.statusText);
    } else if (error.request) {
      // Network error or backend offline
      errorMessage = 'Unable to connect to the Predictive Maintenance API backend (http://localhost:8000). Please ensure the FastAPI server is running.';
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
    const res = await apiClient.get('/health', { timeout: 4000 });
    return {
      connected: true,
      status: res.data?.status || 'healthy',
      models: res.data?.models || {},
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
