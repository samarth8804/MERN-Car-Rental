import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      console.error("Network Error: Please check your internet connection");
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
        success: false,
        type: "NETWORK_ERROR",
      });
    }

    // Extract error details from response
    const { status, data } = error.response;
    const errorMessage = data?.message || "An error occurred";
    const isSuccess = data?.success !== undefined ? data.success : false;

    // Handle different HTTP status codes
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized: Session expired. Please login again.");

        const currentPath = window.location.pathname;
        const isOnAuthPage =
          currentPath.includes("/login") || currentPath.includes("/signup");

        if (!isOnAuthPage) {
          // User is on a protected page and token is invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Try to preserve the role from current path
          const roleMatch = currentPath.match(/\/dashboard\/(\w+)/);
          const targetRole = roleMatch ? roleMatch[1] : "customer";

          window.location.href = `/login/${targetRole}`;
        }
        // If on auth page, let the component handle the error (don't redirect)
      } else if (error.response.status === 403) {
        console.error(
          "Forbidden: You don't have permission to access this resource"
        );
      } else if (error.response.status === 400) {
        console.error("Bad Request:", errorMessage);
      } else if (error.response.status === 404) {
        console.error("Not Found:", errorMessage);
      } else if (error.response.status === 500) {
        console.error("Server Error:", errorMessage);
      } else if (error.response.status === 502) {
        console.error("Bad Gateway: Server is temporarily unavailable");
      } else if (error.response.status === 503) {
        console.error("Service Unavailable: Server is temporarily down");
      } else {
        console.error(`HTTP Error ${status}:`, errorMessage);
      }
    }

    // Handle request timeout
    if (error.code === "ECONNABORTED") {
      console.error("Request Timeout: Please try again");
      return Promise.reject({
        message: "Request timeout. Please try again.",
        success: false,
        type: "TIMEOUT_ERROR",
      });
    }

    // Return structured error for components to handle
    return Promise.reject({
      status,
      message: errorMessage,
      success: isSuccess,
      type: "HTTP_ERROR",
      originalError: error,
      data: data,
      response: error.response, // Include response for components to access
    });
  }
);

export default axiosInstance;
