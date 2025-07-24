import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { useAuth } from "../../context/UserContext";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { roles } from "../../utils/data";
import toast from "react-hot-toast";

// Import smaller components
import Logo from "../../components/common/Logo";
import WelcomeHeader from "../../components/Auth/WelcomeHeader";
import LoginForm from "../../components/Auth/LoginForm";
import RoleSwitcher from "../../components/Auth/RoleSwitcher";
import RoleInfoPanel from "../../components/Auth/RoleInfoPanel";

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Validate role parameter first
  useEffect(() => {
    const validRoles = ["customer", "car-owner", "driver", "admin"];
    if (!validRoles.includes(role)) {
      navigate("/login/customer"); // Redirect to default role if invalid
      return;
    }
  }, [role, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/dashboard/${role}`);
    }
  }, [isAuthenticated, role, navigate]);

  // Find role configuration from data.js
  const currentRoleConfig = roles.find((r) => r.id === role);

  // Fallback if role not found
  const roleConfig = currentRoleConfig || {
    id: "customer",
    title: "Customer",
    description: "Rent cars for your travel needs",
    gradient: "from-blue-500 to-blue-600",
    icon: FaRegUser,
    loginInfo: {
      title: "Welcome Back",
      subtitle: "Sign in to continue",
      highlights: ["Secure platform", "24/7 support", "Easy booking"],
    },
  };

  // Get API endpoint based on role
  const getLoginEndpoint = (userRole) => {
    switch (userRole) {
      case "admin":
        return API_PATHS.AUTH.LOGIN_ADMIN;
      case "customer":
        return API_PATHS.AUTH.LOGIN_CUSTOMER;
      case "car-owner":
        return API_PATHS.AUTH.LOGIN_CAR_OWNER;
      case "driver":
        return API_PATHS.AUTH.LOGIN_DRIVER;
      default:
        return API_PATHS.AUTH.LOGIN_CUSTOMER;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRoleSwitch = () => {
    setFormData({
      email: "",
      password: "",
    });

    setErrors({});

    setLoading(false);
  };

  // Simplified validation - Only basic checks for login
  const validateForm = () => {
    const newErrors = {};

    // Email validation - Basic format only
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Password validation - ONLY check if password exists
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = getLoginEndpoint(role);
      const response = await axiosInstance.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data) {
        const { token, message } = response.data;

        // Get user data from response (different keys for different roles)
        const userData =
          response.data.admin ||
          response.data.customer ||
          response.data.driver ||
          response.data.carOwner;

        // Store token and user data
        localStorage.setItem("token", token);

        // Create standardized user object
        const standardizedUser = {
          id: userData.id,
          name: userData.fullname,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          role: role,
          ...(userData.licenseNumber && {
            licenseNumber: userData.licenseNumber,
          }),
          ...(userData.status && { status: userData.status }),
          ...(userData.rating && { rating: userData.rating }),
          ...(userData.totalRides && { totalRides: userData.totalRides }),
        };

        // Update auth context
        updateUser(standardizedUser);

        toast.success(message || `Welcome back, ${standardizedUser.name}!`);

        // Navigate to role-specific dashboard
        navigate(`/dashboard/${role}`);
      }
    } catch (error) {
      console.error("Login error:", error);

      // ✅ Enhanced error handling - Prevent navigation, only show toasts
      if (error.type === "NETWORK_ERROR") {
        toast.error("Network error. Please check your connection.");
      } else if (error.type === "TIMEOUT_ERROR") {
        toast.error("Request timeout. Please try again.");
      } else if (error.status === 401) {
        toast.error("Invalid email or password");
        // ✅ Clear password field for security
        setFormData((prev) => ({ ...prev, password: "" }));
      } else if (error.status === 400) {
        toast.error(error.message || "Please check your input");
      } else if (error.status === 404) {
        toast.error("User not found. Please check your credentials.");
      } else if (error.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }

      // ✅ Ensure we stay on the current login page - no navigation
      // Do not call navigate() here - just show toast and stay put
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Two Column Layout */}
      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <Logo className="mb-8 lg:hidden" />

            {/* Desktop Logo */}
            <Logo className="hidden lg:flex items-center mb-8" />

            {/* Welcome Header */}
            <WelcomeHeader />

            {/* Login Form */}
            <LoginForm
              formData={formData}
              errors={errors}
              loading={loading}
              roleConfig={roleConfig}
              role={role}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />

            {/* Role Switcher */}
            <RoleSwitcher currentRole={role} onRoleSwitch={handleRoleSwitch} />
          </div>
        </div>

        {/* Right Side - Role Information */}
        <RoleInfoPanel roleConfig={roleConfig} />
      </div>
    </div>
  );
};

export default Login;
