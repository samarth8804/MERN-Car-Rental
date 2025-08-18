export const carValidationRules = {
  brand: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s]+$/,
    message: "Brand must contain only letters, numbers and spaces",
  },
  model: {
    required: true,
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s]+$/,
    message: "Model must contain only letters, numbers and spaces",
  },
  year: {
    required: true,
    min: 2015,
    max: new Date().getFullYear() + 1,
    message: "Year must be between 2015 and next year",
  },
  licensePlate: {
    required: true,
    minLength: 6,
    maxLength: 15,
    pattern: /^[A-Z0-9]+$/,
    message: "License plate must contain only uppercase letters and numbers",
  },
  city: {
    required: true,
    message: "Please select a city",
  },
  pricePerDay: {
    required: true,
    min: 500,
    max: 10000,
    message: "Price per day must be between ₹500 and ₹10,000",
  },
  pricePerKm: {
    required: true,
    min: 5,
    max: 100,
    message: "Price per KM must be between ₹5 and ₹100",
  },
  imageUrl: {
    required: true,
    message: "Please upload a car image",
  },
};

// ✅ IMPROVED: Better field validation with more specific messages
export const validateCarField = (fieldName, value) => {
  const rules = carValidationRules[fieldName];
  if (!rules) return null;

  // ✅ FIXED: Better empty value checking
  const isEmpty = !value || value.toString().trim() === "";

  // Check if required
  if (rules.required && isEmpty) {
    const fieldDisplayNames = {
      brand: "Car Brand",
      model: "Car Model",
      year: "Manufacturing Year",
      licensePlate: "License Plate",
      city: "City",
      pricePerDay: "Price Per Day",
      pricePerKm: "Price Per KM",
      imageUrl: "Car Image",
    };

    return `${fieldDisplayNames[fieldName] || fieldName} is required`;
  }

  // If field is empty but not required, it's valid
  if (isEmpty) return null;

  const stringValue = value.toString().trim();

  // ✅ IMPROVED: More specific length validation messages
  if (rules.minLength && stringValue.length < rules.minLength) {
    if (fieldName === "brand") {
      return "Brand name must be at least 2 characters long";
    } else if (fieldName === "licensePlate") {
      return "License plate must be at least 6 characters long";
    }
    return `${fieldName} must be at least ${rules.minLength} characters long`;
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    if (fieldName === "licensePlate") {
      return "License plate cannot exceed 15 characters";
    }
    return `${fieldName} cannot exceed ${rules.maxLength} characters`;
  }

  // ✅ IMPROVED: Better number validation
  if (rules.min !== undefined || rules.max !== undefined) {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      if (fieldName === "year") {
        return "Please enter a valid year";
      } else if (fieldName === "pricePerDay") {
        return "Please enter a valid price per day";
      } else if (fieldName === "pricePerKm") {
        return "Please enter a valid price per KM";
      }
      return "Please enter a valid number";
    }

    if (rules.min !== undefined && numValue < rules.min) {
      if (fieldName === "year") {
        return `Year must be ${rules.min} or later`;
      } else if (fieldName === "pricePerDay") {
        return `Daily rate must be at least ₹${rules.min}`;
      } else if (fieldName === "pricePerKm") {
        return `Per KM rate must be at least ₹${rules.min}`;
      }
      return `Value must be at least ${rules.min}`;
    }

    if (rules.max !== undefined && numValue > rules.max) {
      if (fieldName === "year") {
        return `Year cannot be later than ${rules.max}`;
      } else if (fieldName === "pricePerDay") {
        return `Daily rate cannot exceed ₹${rules.max}`;
      } else if (fieldName === "pricePerKm") {
        return `Per KM rate cannot exceed ₹${rules.max}`;
      }
      return `Value cannot exceed ${rules.max}`;
    }
  }

  // ✅ IMPROVED: Better pattern validation messages
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    if (fieldName === "brand" || fieldName === "model") {
      return `${fieldName} can only contain letters, numbers and spaces`;
    } else if (fieldName === "licensePlate") {
      return "License plate can only contain uppercase letters and numbers";
    }
    return rules.message || `${fieldName} format is invalid`;
  }

  return null; // Valid
};

// ✅ IMPROVED: Better form validation with detailed error summary
export const validateEntireCarForm = (formData) => {
  const errors = {};
  const fieldOrder = [
    "imageUrl",
    "brand",
    "model",
    "year",
    "licensePlate",
    "city",
    "pricePerDay",
    "pricePerKm",
  ];

  fieldOrder.forEach((field) => {
    const error = validateCarField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    errorCount: Object.keys(errors).length,
    firstError: Object.keys(errors)[0], // Field name of first error
  };
};
