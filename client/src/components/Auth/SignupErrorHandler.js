import toast from "react-hot-toast";

// Registration error handler (extracted from handleRegister)
export const handleRegistrationError = (error, setErrors, setFormData) => {
  console.error("Registration error:", error);

  if (error.response) {
    const { status, data } = error.response;

    if (status === 400) {
      const message = data.message;

      if (
        message === "Customer already exists" ||
        message === "CarOwner already exists" ||
        message === "Driver already exists with this email"
      ) {
        toast.error(
          "An account with this email already exists. Please try logging in instead."
        );
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else if (message === "Invalid email format") {
        setErrors({ email: "Please enter a valid email address" });
        toast.error("Invalid email format.");
      } else if (message === "Invalid phone number format") {
        setErrors({ phone: "Please enter a valid 10-digit phone number" });
        toast.error("Invalid phone number format.");
      } else if (message === "Invalid email domain") {
        setErrors({ email: "This email domain is not valid" });
        toast.error("Invalid email domain. Please use a valid email address.");
      } else if (message === "Invalid license number format") {
        setErrors({ licenseNumber: "Invalid license format" });
        toast.error("Invalid license format. Please check and try again.");
      } else if (message === "License number already exists") {
        setErrors({
          licenseNumber: "This license number is already registered",
        });
        toast.error(
          "License number already exists. Please check and try again."
        );
      } else if (message.includes("Password must be at least 8 characters")) {
        setErrors({ password: "Password must meet all requirements" });
        toast.error(
          "Password must be 8+ characters with uppercase, lowercase, number & special character."
        );
      } else if (message === "All fields are required") {
        toast.error("Please fill in all required fields.");
      } else {
        toast.error(message || "Registration failed. Please check your input.");
      }
    } else if (status === 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(data?.message || "Registration failed. Please try again.");
    }
  } else if (error.type === "NETWORK_ERROR") {
    toast.error("Network error. Please check your connection.");
  } else if (error.type === "TIMEOUT_ERROR") {
    toast.error("Request timeout. Please try again.");
  } else {
    toast.error("Registration failed. Please try again.");
  }
};

// OTP verification error handler (extracted from handleOTPVerification)
export const handleOTPVerificationError = (
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
) => {
  console.error("OTP verification error:", error);

  if (error.response) {
    const { status, data } = error.response;

    if (status === 400) {
      const message = data.message;

      if (message === "Invalid OTP") {
        const newRetryCount = otpRetries + 1;
        setOtpRetries(newRetryCount);

        if (newRetryCount >= MAX_OTP_RETRIES) {
          toast.error("Too many invalid attempts. Please request a new OTP.");
          // Reset everything and go back to step 1
          setCurrentStep(1);
          setOtpRetries(0);
          setOtpSent(false);
          setFormData((prev) => ({ ...prev, otp: "" }));
          setErrors({});
        } else {
          setErrors({
            otp: `Invalid OTP. ${
              MAX_OTP_RETRIES - newRetryCount
            } attempts remaining.`,
          });
          toast.error(
            `Invalid OTP. ${MAX_OTP_RETRIES - newRetryCount} attempts left.`
          );
        }
      } else if (
        message === "Customer already exists" ||
        message === "CarOwner already exists" ||
        message === "Driver already exists with this email"
      ) {
        toast.error("Account already exists. Redirecting to login...");
        setTimeout(() => {
          navigate(`/login/${role}`);
        }, 2000);
      } else if (
        message === "Invalid email format" ||
        message === "Invalid phone number format" ||
        message === "Invalid email domain" ||
        message.includes("Password must be at least 8 characters") ||
        message === "License number already exists" ||
        message === "All fields are required"
      ) {
        toast.error(
          "Registration data issue. Please start registration again."
        );
        setCurrentStep(1);
        setOtpRetries(0);
        setOtpSent(false);
        setErrors({});
      } else {
        toast.error(message || "Verification failed. Please try again.");
      }
    } else if (status === 500) {
      toast.error("Server error during verification. Please try again.");
    } else {
      toast.error(data?.message || "Verification failed. Please try again.");
    }
  } else if (error.type === "NETWORK_ERROR") {
    toast.error("Network error. Please check your connection.");
  } else if (error.type === "TIMEOUT_ERROR") {
    toast.error("Request timeout. Please try again.");
  } else {
    toast.error("Verification failed. Please try again.");
  }
};

// Resend OTP error handler (extracted from handleResendOTP)
export const handleResendOTPError = (
  error,
  setCurrentStep,
  setOtpSent,
  navigate,
  role
) => {
  console.error("Resend OTP error:", error);

  if (error.response) {
    const { status, data } = error.response;
    const message = data.message;

    if (status === 400) {
      if (
        message === "Customer already exists" ||
        message === "CarOwner already exists" ||
        message === "Driver already exists with this email"
      ) {
        toast.error("Account already exists. Redirecting to login...");
        setTimeout(() => {
          navigate(`/login/${role}`);
        }, 2000);
      } else if (message === "License number already exists") {
        toast.error(
          "License number already exists. Please use a different license number."
        );
        setCurrentStep(1);
        setOtpSent(false);
      } else {
        toast.error(message || "Failed to resend OTP. Please try again.");
      }
    } else if (status === 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error("Failed to resend OTP. Please try again.");
    }
  } else {
    toast.error("Network error. Please check your connection.");
  }
};
