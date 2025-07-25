// Form validation function (updated to include terms validation)
export const validateSignupForm = (formData, role, loading) => {
  if (loading) return { isValid: false, errors: {} };

  const newErrors = {};

  // Full name validation
  if (!formData.fullname?.trim()) {
    newErrors.fullname = "Full name is required";
  } else if (formData.fullname.trim().length < 2) {
    newErrors.fullname = "Full name must be at least 2 characters";
  }

  // Email validation
  if (!formData.email?.trim()) {
    newErrors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
  }

  // Phone validation
  if (!formData.phone?.trim()) {
    newErrors.phone = "Phone number is required";
  } else {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
  }

  // Address validation
  if (!formData.address?.trim()) {
    newErrors.address = "Address is required";
  } else if (formData.address.trim().length < 10) {
    newErrors.address = "Please enter a complete address";
  }

  // Password validation
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8+ chars with uppercase, lowercase, number & special character";
    }
  }

  // Confirm password validation
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  // Driver-specific validation
  if (role === "driver") {
    // ✅ CITY VALIDATION FOR DRIVERS
    if (!formData.city?.trim()) {
      newErrors.city = "Operating city is required for drivers";
    }

    // License number validation
    if (!formData.licenseNumber?.trim()) {
      newErrors.licenseNumber = "License number is required for drivers";
    } else {
      const license = formData.licenseNumber.trim().toUpperCase();
      const licenseRegex = /^[A-Z]{2}\d{2}\d{4}\d{7}$/;

      if (license.length !== 15) {
        newErrors.licenseNumber =
          "License number must be exactly 15 characters";
      } else if (!licenseRegex.test(license)) {
        newErrors.licenseNumber = "Invalid license format";
      } else {
        const currentYear = new Date().getFullYear();
        const issueYear = parseInt(license.substring(4, 8));

        if (issueYear < 1980 || issueYear > currentYear) {
          newErrors.licenseNumber = "Invalid license format";
        }
      }
    }
  }

  // ✅ Terms and conditions validation - THIS IS THE KEY FIX
  if (!formData.acceptTerms) {
    newErrors.acceptTerms =
      "You must accept the terms and conditions to continue";
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
  };
};

// Input processing function
export const processInputValue = (name, value) => {
  let processedValue = value;

  // Format license number automatically
  if (name === "licenseNumber") {
    // Convert to uppercase and remove spaces/special characters
    processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Limit to 15 characters
    if (processedValue.length > 15) {
      processedValue = processedValue.substring(0, 15);
    }
  }

  return processedValue;
};
