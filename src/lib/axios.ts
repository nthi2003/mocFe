import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "https://localhost:7097/api",
});

// Helper functions
const isClient = () => typeof window !== "undefined";

const clearAuthData = () => {
  if (isClient()) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token) as { exp?: number };
    return decoded.exp ? decoded.exp * 1000 < Date.now() : true;
  } catch {
    return true;
  }
};

const handleTokenExpiration = () => {
  clearAuthData();
  if (isClient()) {
    window.location.href = "/login";
  }
};

// Initial auth check
if (isClient()) {
  const token = localStorage.getItem("accessToken");
  if (token && isTokenExpired(token)) {
    handleTokenExpiration();
  }
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (isClient()) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        if (isTokenExpired(token)) {
          handleTokenExpiration();
          return Promise.reject(new Error("Token expired"));
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleTokenExpiration();
    }
    return Promise.reject(error);
  }
);

// Named export
export const api = axiosInstance;