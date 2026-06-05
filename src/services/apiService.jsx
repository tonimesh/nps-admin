import axios from "axios";

const BASE_URL = "https://adminnps.ayursinfotech.com/api";

// Flag to prevent multiple refresh token calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      config.headers.Authorization = token;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If it's not a 401 error or already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // If refresh is already in progress, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = token;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    const refreshToken = localStorage.getItem("refreshToken");
    
    // If no refresh token, redirect to login
    if (!refreshToken) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }
    
    try {
      const response = await axios.post(`${BASE_URL}/v1/auth/refersh-token`, {
        refreshToken: refreshToken
      });
      
      const newAccessToken = response.data.data.access_token;
      const newRefreshToken = response.data.data.refresh_token;
      const expiresAt = response.data.data.expires_at;
      
      // Store new tokens
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("tokenExpiresAt", expiresAt);
      
      // Calculate and store token duration
      const duration = response.data.data.duration;
      localStorage.setItem("tokenDuration", duration);
      
      // Update default authorization header
      api.defaults.headers.common["Authorization"] = newAccessToken;
      
      // Process queued requests
      processQueue(null, newAccessToken);
      
      // Retry the original request
      originalRequest.headers.Authorization = newAccessToken;
      return api(originalRequest);
      
    } catch (refreshError) {
      // Refresh failed - clear storage and redirect to login
      processQueue(refreshError, null);
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Function to check if token is expired
export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem("tokenExpiresAt");
  if (!expiresAt) return true;
  
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  
  // Add 30 seconds buffer to refresh before actual expiry
  const bufferTime = 30 * 1000; // 30 seconds
  return now.getTime() + bufferTime > expiryDate.getTime();
};

// Function to schedule token refresh before expiry
export const scheduleTokenRefresh = () => {
  const expiresAt = localStorage.getItem("tokenExpiresAt");
  if (!expiresAt) return;
  
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const timeUntilExpiry = expiryDate.getTime() - now.getTime();
  
  // Refresh 60 seconds before expiry
  const refreshTime = timeUntilExpiry - 60 * 1000;
  
  if (refreshTime > 0) {
    setTimeout(async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken && isTokenExpired()) {
        try {
          const response = await axios.post(`${BASE_URL}/v1/auth/refersh-token`, {
            refreshToken: refreshToken
          });
          
          const newAccessToken = response.data.data.access_token;
          const newRefreshToken = response.data.data.refresh_token;
          const newExpiresAt = response.data.data.expires_at;
          
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          localStorage.setItem("tokenExpiresAt", newExpiresAt);
          
          api.defaults.headers.common["Authorization"] = newAccessToken;
          
          console.log("Token refreshed successfully");
          
          // Schedule next refresh
          scheduleTokenRefresh();
        } catch (error) {
          console.error("Scheduled token refresh failed:", error);
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }, refreshTime);
  }
};

// Function to setup token refresh on app load
export const setupTokenRefresh = () => {
  const accessToken = localStorage.getItem("accessToken");
  const expiresAt = localStorage.getItem("tokenExpiresAt");
  
  if (accessToken && expiresAt) {
    // Check if token is already expired
    if (isTokenExpired()) {
      // Try to refresh immediately
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        axios.post(`${BASE_URL}/v1/auth/refersh-token`, { refreshToken })
          .then(response => {
            const newAccessToken = response.data.data.access_token;
            const newRefreshToken = response.data.data.refresh_token;
            const newExpiresAt = response.data.data.expires_at;
            
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            localStorage.setItem("tokenExpiresAt", newExpiresAt);
            
            api.defaults.headers.common["Authorization"] = newAccessToken;
            scheduleTokenRefresh();
          })
          .catch(() => {
            localStorage.clear();
            window.location.href = "/login";
          });
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    } else {
      // Token is valid, schedule refresh
      api.defaults.headers.common["Authorization"] = accessToken;
      scheduleTokenRefresh();
    }
  }
};

export default api;