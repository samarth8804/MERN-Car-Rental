import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { useAuth } from "../../context/UserContext";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { roles } from "../../utils/data";
import toast from "react-hot-toast";

// Components
import Logo from "../../components/common/Logo";
import WelcomeHeader from "../../components/Auth/WelcomeHeader";
import SignupForm from "../../components/Auth/SignupForm";
import OTPVerificationForm from "../../components/Auth/OTPVerificationForm";
import RoleSwitcher from "../../components/Auth/RoleSwitcher";
import RoleInfoPanel from "../../components/Auth/RoleInfoPanel";

// Utils (extracted)
import {
  validateSignupForm,
  processInputValue,
} from "../../components/Auth/SignupValidation";
import {
  handleRegistrationError,
  handleOTPVerificationError,
  handleResendOTPError,
} from "../../components/Auth/SignupErrorHandler";

const Signup = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Form states
  const [currentStep, setCurrentStep] = useState(1); // 1: Signup Form, 2: OTP Verification
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "", // Only for drivers
    otp: "",
    acceptTerms: false, // ✅ Added terms acceptance
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpRetries, setOtpRetries] = useState(0);
  const MAX_OTP_RETRIES = 3;

  // Validate role parameter
  useEffect(() => {
    const validRoles = ["customer", "car-owner", "driver"];
    if (!validRoles.includes(role)) {
      navigate("/signup/customer");
      return;
    }
  }, [role, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/dashboard/${role}`);
    }
  }, [isAuthenticated, role, navigate]);

  // Clean slate when component mounts or role changes
  useEffect(() => {
    setCurrentStep(1);
    setOtpSent(false);
    setOtpRetries(0);
    setErrors({});
    setLoading(false);
    setFormData({
      fullname: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      licenseNumber: "",
      otp: "",
      acceptTerms: false, // ✅ Reset terms acceptance
    });
  }, [role]);

  // Find role configuration
  const currentRoleConfig = roles.find((r) => r.id === role);
  const roleConfig = currentRoleConfig || {
    id: "customer",
    title: "Customer",
    description: "Rent cars for your travel needs",
    gradient: "from-blue-500 to-blue-600",
    icon: FaRegUser,
    loginInfo: {
      title: "Join easyGo",
      subtitle: "Create your account",
      highlights: [
        "Easy registration",
        "Email verification",
        "Secure platform",
      ],
    },
  };

  // Get registration endpoint
  const getRegisterEndpoint = (userRole) => {
    switch (userRole) {
      case "customer":
        return API_PATHS.AUTH.REGISTER_CUSTOMER;
      case "car-owner":
        return API_PATHS.AUTH.REGISTER_CAR_OWNER;
      case "driver":
        return API_PATHS.AUTH.REGISTER_DRIVER;
      default:
        return API_PATHS.AUTH.REGISTER_CUSTOMER;
    }
  };

  // Get create account endpoint
  const getCreateEndpoint = (userRole) => {
    switch (userRole) {
      case "customer":
        return API_PATHS.AUTH.CREATE_CUSTOMER;
      case "car-owner":
        return API_PATHS.AUTH.CREATE_CAR_OWNER;
      case "driver":
        return API_PATHS.AUTH.CREATE_DRIVER;
      default:
        return API_PATHS.AUTH.CREATE_CUSTOMER;
    }
  };

  // ✅ Form validation - Updated to properly use the validation function
  const validateForm = () => {
    console.log("🔍 Validating form data:", formData); // Debug log
    const validation = validateSignupForm(formData, role, loading);
    console.log("🔍 Validation result:", validation); // Debug log
    setErrors(validation.errors);
    return validation.isValid;
  };

  // Input change handler (using extracted processing function)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox inputs
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      // Use extracted processing function for other inputs
      const processedValue = processInputValue(name, value);

      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));
    }

    // Clear error when user starts typing/changing input
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ✅ Handle terms acceptance change
  const handleTermsChange = (accepted) => {
    console.log("🔍 Terms changed:", accepted); // Debug log
    setFormData((prev) => ({
      ...prev,
      acceptTerms: accepted,
    }));

    // Clear error when user accepts terms
    if (errors.acceptTerms && accepted) {
      setErrors((prev) => ({
        ...prev,
        acceptTerms: "",
      }));
    }
  };

  // ✅ Step 1: Register user and send OTP - Updated with proper validation
  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("🔍 Form submission attempted with data:", formData); // Debug log

    // ✅ Validate form before proceeding
    if (!validateForm()) {
      console.log("❌ Form validation failed:", errors); // Debug log
      toast.error("Please fill all required fields correctly");
      return;
    }

    console.log("✅ Form validation passed, proceeding with registration"); // Debug log

    setOtpRetries(0);
    setLoading(true);

    try {
      const endpoint = getRegisterEndpoint(role);
      const requestData = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        ...(role === "driver" && { licenseNumber: formData.licenseNumber }),
      };

      const response = await axiosInstance.post(endpoint, requestData);

      if (response.data) {
        setOtpSent(true);
        setCurrentStep(2);
        setFormData((prev) => ({ ...prev, otp: "" }));
        setErrors((prev) => ({ ...prev, otp: "" }));
        toast.success(response.data.message || "OTP sent to your email!");
      }
    } catch (error) {
      // Use extracted error handler
      handleRegistrationError(error, setErrors, setFormData);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and create account
  const handleOTPVerification = async (e) => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      setErrors({ otp: "Please enter the OTP sent to your email" });
      return;
    }

    if (formData.otp.length !== 4) {
      setErrors({ otp: "OTP must be 4 digits" });
      return;
    }

    setLoading(true);
    try {
      const endpoint = getCreateEndpoint(role);
      const requestData = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        otp: formData.otp,
        ...(role === "driver" && { licenseNumber: formData.licenseNumber }),
      };

      const response = await axiosInstance.post(endpoint, requestData);

      if (response.data) {
        setOtpRetries(0);
        toast.success(response.data.message || "Account created successfully!");

        // Clear form data for security
        setFormData({
          fullname: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          confirmPassword: "",
          licenseNumber: "",
          otp: "",
          acceptTerms: false, // ✅ Reset terms acceptance
        });

        // Role-specific success messages
        if (role === "driver") {
          toast.success(
            "Please wait for admin approval before you can log in.",
            {
              duration: 5000,
            }
          );
        } else if (role === "car-owner") {
          toast.success("Welcome! You can now start listing your vehicles.", {
            duration: 4000,
          });
        } else {
          toast.success("Welcome! You can now start renting vehicles.", {
            duration: 4000,
          });
        }

        setTimeout(() => {
          navigate(`/login/${role}`);
        }, 2000);
      }
    } catch (error) {
      // Use extracted error handler
      handleOTPVerificationError(
        error,
        otpRetries,
        MAX_OTP_RETRIES,
        setOtpRetries,
        setCurrentStep,
        setOtpSent,
        setFormData,
        setErrors,
        navigate,
        role
      );
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);

    try {
      const endpoint = getRegisterEndpoint(role);
      const requestData = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        ...(role === "driver" && { licenseNumber: formData.licenseNumber }),
      };

      const response = await axiosInstance.post(endpoint, requestData);

      if (response.data) {
        setOtpRetries(0);
        setErrors((prev) => ({ ...prev, otp: "" }));
        setFormData((prev) => ({ ...prev, otp: "" }));
        toast.success("New OTP sent to your email!");
      }
    } catch (error) {
      // Use extracted error handler
      handleResendOTPError(error, setCurrentStep, setOtpSent, navigate, role);
    } finally {
      setLoading(false);
    }
  };

  // Clear form when role changes (only allowed during step 1)
  const handleRoleSwitch = () => {
    if (currentStep === 1) {
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
        licenseNumber: "",
        otp: "",
        acceptTerms: false, // ✅ Reset terms acceptance
      });
      setErrors({});
      setOtpSent(false);
      setOtpRetries(0);
      setLoading(false);
    }
  };

  // Enhanced back to registration function with proper reset
  const handleBackToRegistration = () => {
    setCurrentStep(1);
    setOtpSent(false);
    setOtpRetries(0);
    setFormData((prev) => ({ ...prev, otp: "" }));
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left Side - Form (Wider for signup) */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="w-full max-w-lg mx-auto">
            {/* Logo */}
            <Logo className="mb-8 lg:hidden" />
            <Logo className="hidden lg:flex items-center mb-8" />

            {/* Welcome Header */}
            <WelcomeHeader isSignup={true} />

            {/* Forms */}
            {currentStep === 1 ? (
              <SignupForm
                formData={formData}
                errors={errors}
                loading={loading}
                roleConfig={roleConfig}
                role={role}
                onInputChange={handleInputChange}
                onTermsChange={handleTermsChange} // ✅ Added terms handler
                onSubmit={handleRegister} // ✅ Direct function reference, no conditional
              />
            ) : (
              <OTPVerificationForm
                formData={formData}
                errors={errors}
                loading={loading}
                roleConfig={roleConfig}
                role={role}
                onInputChange={handleInputChange}
                onSubmit={handleOTPVerification}
                onResendOTP={handleResendOTP}
                onBack={handleBackToRegistration}
                otpRetries={otpRetries}
                maxRetries={MAX_OTP_RETRIES}
              />
            )}

            {/* Role Switcher - Only show during step 1 */}
            {currentStep === 1 && (
              <RoleSwitcher
                currentRole={role}
                onRoleSwitch={handleRoleSwitch}
              />
            )}
          </div>
        </div>

        {/* Right Side - Role Information (Narrower for signup) */}
        <div className="hidden lg:block lg:w-2/5">
          <RoleInfoPanel roleConfig={roleConfig} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
