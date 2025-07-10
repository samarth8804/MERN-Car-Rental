import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Intialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        // Decode token to check if its expired
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp > currentTime) {
          // Token is valid
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          // Token is expired
          clearUser();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        clearUser();
      }
    }
    setIsLoading(false);
  };

  // Function to update user data
  const updateUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  // Function to clear user data (logout)
  const clearUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // Get user role
  const getUserRole = () => {
    return user?.role || null;
  };

  // Get redirect path based on user role
  const getRedirectPath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "admin":
        return "/dashboard/admin";
      case "customer":
        return "/dashboard/customer";
      case "car-owner":
        return "/dashboard/car-owner";
      case "driver":
        return "/dashboard/driver";
      default:
        return "/";
    }
  };

  const value = {
    // State
    user,
    token,
    isLoading,
    isAuthenticated,

    // Actions
    updateUser,
    clearUser,

    // Utility functions
    getUserRole,
    getRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export AuthContext for compatibility
export const UserContext = AuthContext;
