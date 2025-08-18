import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  FaTimes,
  FaCar,
  FaSave,
  FaSpinner,
  FaUpload,
  FaImage,
  FaTrash,
  FaPlus,
  FaEdit,
  FaExclamationTriangle,
} from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import {
  validateCarField,
  validateEntireCarForm,
} from "../../../utils/dashboard/carValidationRules";

const INDIAN_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Coimbatore",
  "Visakhapatnam",
  "Vadodara",
  "Patna",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Madurai",
  "Nashik",
];

const UnifiedCarModal = ({
  isOpen,
  onClose,
  mode = "add", // "add", "edit", or "delete"
  car = null,
  onCarAdded,
  onCarUpdated,
  onCarDeleted, // ✅ ADD: Delete callback
}) => {
  const isEditMode = mode === "edit";
  const isDeleteMode = mode === "delete"; // ✅ ADD: Delete mode check
  const isAddMode = mode === "add";

  // Initial form state
  const getInitialFormData = () => ({
    brand: "",
    model: "",
    year: new Date().getFullYear().toString(),
    licensePlate: "",
    city: "",
    pricePerDay: "",
    pricePerKm: "",
    imageUrl: "",
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ✅ FIXED: Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && car) {
        const newFormData = {
          brand: car.brand || "",
          model: car.model || "",
          year: car.year?.toString() || "",
          licensePlate: car.licensePlate || "",
          city: car.city || "",
          pricePerDay: car.pricePerDay?.toString() || "",
          pricePerKm: car.pricePerKm?.toString() || "",
          imageUrl: car.imageUrl || "",
        };
        setFormData(newFormData);

        // ✅ FIXED: Reset image states properly for edit mode
        if (car.imageUrl) {
          setImageLoaded(false); // Will be set to true when image loads
          setImageError(false);
        } else {
          setImageLoaded(false);
          setImageError(false);
        }
      } else {
        setFormData(getInitialFormData());
        setImageLoaded(false);
        setImageError(false);
      }
      setErrors({});
    } else {
      // Reset states when modal closes
      setImageLoaded(false);
      setImageError(false);
      setFormData(getInitialFormData());
      setErrors({});
    }
  }, [isOpen, mode, car, isEditMode]);

  const getModalTitle = () => {
    if (isDeleteMode) return "Delete Car";
    if (isEditMode) return "Edit Car Details";
    return "Add New Car";
  };

  const getModalIcon = () => {
    if (isDeleteMode) return FaTrash;
    if (isEditMode) return FaEdit;
    return FaPlus;
  };

  // ✅ FIXED: Handle image load success
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // ✅ FIXED: Handle image load error
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Retry image loading
  const handleImageRetry = () => {
    setImageError(false);
    setImageLoaded(false);

    // Force image reload by adding timestamp
    const currentUrl = formData.imageUrl;
    if (currentUrl) {
      const separator = currentUrl.includes("?") ? "&" : "?";
      const newUrl = currentUrl + separator + "t=" + Date.now();
      setFormData((prev) => ({ ...prev, imageUrl: newUrl }));
    }
  };

  // Remove current image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setImageLoaded(false);
    setImageError(false);
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageUploading(true);
    setImageError(false);
    setImageLoaded(false);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const response = await axiosInstance.post(
        API_PATHS.UPLOAD.UPLOAD_IMAGE,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
        setErrors((prev) => ({ ...prev, imageUrl: null }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  // ✅ IMPROVED: Handle input changes with better error management
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Format specific fields
    let formattedValue = value;
    if (name === "licensePlate") {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    } else if (name === "pricePerDay" || name === "pricePerKm") {
      formattedValue = value.replace(/[^0-9]/g, "");
    } else if (name === "brand" || name === "model") {
      formattedValue = value.replace(/[^a-zA-Z0-9\s]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    // ✅ IMPROVED: Clear error immediately when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    // ✅ IMPROVED: Only validate on blur or when field has content
    // Don't show errors while user is still typing
    // if (formattedValue.trim() !== "") {
    //   const error = validateCarField(name, formattedValue);
    //   if (error) {
    //     // Delay showing error to avoid interrupting typing
    //     setTimeout(() => {
    //       setErrors((prev) => ({ ...prev, [name]: error }));
    //     }, 500);
    //   }
    // }
  };

  // ✅ ADD: Handle field blur for immediate validation
  const handleInputBlur = (e) => {
    const { name, value } = e.target;

    // Only validate if field has content or is required
    if (value.trim() !== "") {
      const error = validateCarField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      // Clear error if field is empty (will be caught by form submission validation)
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // ✅ IMPROVED: Form submission with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate entire form
    const {
      isValid,
      errors: validationErrors,
      errorCount,
      firstError,
    } = validateEntireCarForm(formData);

    if (!isValid) {
      setErrors(validationErrors);

      // ✅ IMPROVED: More specific error messages
      if (errorCount === 1) {
        toast.error(`Please fix the error in ${firstError} field`);
      } else if (errorCount <= 3) {
        toast.error(`Please fix ${errorCount} errors before submitting`);
      } else {
        toast.error(
          `Please complete all required fields (${errorCount} errors found)`
        );
      }

      // ✅ IMPROVED: Scroll to first error field
      const firstErrorElement = document.querySelector(
        `[name="${firstError}"]`
      );
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        firstErrorElement.focus();
      }

      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        year: parseInt(formData.year),
        pricePerDay: parseFloat(formData.pricePerDay),
        pricePerKm: parseFloat(formData.pricePerKm),
      };

      let response;

      if (isEditMode) {
        // Update existing car
        response = await axiosInstance.put(
          API_PATHS.CAR_OWNER.UPDATE_CAR(car._id),
          submitData
        );
      } else {
        // Add new car
        response = await axiosInstance.post(
          API_PATHS.CAR_OWNER.ADD_CAR,
          submitData
        );
      }

      if (response.data.success) {
        const successMessage = isEditMode
          ? "Car updated successfully and submitted for re-approval!"
          : "Car submitted for approval successfully!";

        toast.success(successMessage);

        // Call appropriate callback
        if (isEditMode && onCarUpdated) {
          onCarUpdated();
        } else if (!isEditMode && onCarAdded) {
          onCarAdded();
        }

        onClose();
      } else {
        toast.error(
          response.data.message ||
            `Failed to ${isEditMode ? "update" : "add"} car`
        );
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} car:`, error);

      // ✅ IMPROVED: Better error handling for API errors
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message;
        if (errorMessage?.includes("license plate")) {
          setErrors((prev) => ({
            ...prev,
            licensePlate: "This license plate is already registered",
          }));
          toast.error("License plate already exists");
        } else if (errorMessage?.includes("validation")) {
          toast.error("Please check your input and try again");
        } else {
          toast.error(errorMessage || "Invalid data provided");
        }
      } else if (error.response?.status === 401) {
        toast.error("Please login again to continue");
      } else if (error.response?.status === 413) {
        toast.error("Image file too large. Please use a smaller image");
      } else {
        toast.error(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "add"} car. Please try again.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete car function
  const handleDeleteCar = async () => {
    if (!car?._id) {
      toast.error("Car ID not found");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.delete(
        API_PATHS.CAR.DELETE_CAR(car._id)
      );

      if (response.data.success) {
        toast.success("Car deleted successfully!");

        if (onCarDeleted) {
          onCarDeleted();
        }

        onClose();
      } else {
        toast.error(response.data.message || "Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);

      if (error.response?.status === 400) {
        toast.error(
          error.response.data?.message ||
            "Cannot delete car with active bookings"
        );
      } else if (error.response?.status === 404) {
        toast.error("Car not found or unauthorized access");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to delete car. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* ✅ FIXED: Backdrop with proper z-index */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
        onClick={handleClose}
        style={{ zIndex: 51 }}
      />

      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* ✅ FIXED: Modal Content with proper z-index and max-height */}
        <div
          className="relative inline-block w-full max-w-4xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl border border-gray-200"
          style={{
            zIndex: 52,
            maxHeight: "95vh", // Prevent modal from exceeding viewport
          }}
        >
          {/* ✅ FIXED: Sticky Header */}
          <div
            className={`sticky top-0 px-6 py-4 ${
              isDeleteMode
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : "bg-gradient-to-r from-blue-500 to-purple-600"
            }`}
            style={{ zIndex: 53 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                  {React.createElement(getModalIcon(), {
                    className: "w-6 h-6 text-white",
                  })}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {getModalTitle()}
                </h2>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="p-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 border border-transparent hover:border-white/30 disabled:opacity-50"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ✅ FIXED: Scrollable Form Content */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(95vh - 80px)" }}
          >
            {isDeleteMode ? (
              // ✅ DELETE CONFIRMATION UI
              <div className="p-6 text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="w-10 h-10 text-red-600" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    Are you sure you want to delete this car?
                  </h3>
                  <p className="text-gray-600">
                    This action cannot be undone. The car will be permanently
                    removed from your fleet.
                  </p>
                </div>

                {car && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-4">
                      {car.imageUrl && (
                        <img
                          src={car.imageUrl}
                          alt={`${car.brand} ${car.model}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                        />
                      )}
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {car.brand} {car.model}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {car.year} • {car.licensePlate}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{car.pricePerDay}/day • ₹{car.pricePerKm}/km •{" "}
                          {car.city}
                        </p>
                        {car.status && (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                              car.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : car.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {car.status.charAt(0).toUpperCase() +
                              car.status.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ IMPROVED: Delete Warning Information Box */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaExclamationTriangle className="text-red-600 mt-1 flex-shrink-0 w-5 h-5" />
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-semibold text-red-900 mb-2">
                        Deletion Consequences
                      </h4>
                      <ul className="text-sm text-red-800 space-y-1.5">
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 text-xs">•</span>
                          <span>
                            Cars with active or upcoming bookings cannot be
                            deleted
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 text-xs">•</span>
                          <span>
                            All car details and images will be permanently
                            removed
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 text-xs">•</span>
                          <span>
                            Historical booking data will remain for records
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 text-xs">•</span>
                          <span>
                            You can re-add the car later, but it will need
                            re-approval
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 text-xs">•</span>
                          <span>Customer reviews and ratings will be lost</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* ✅ IMPROVED: Status-based additional warning */}
                {car?.status === "approved" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-sm text-yellow-800 font-medium">
                        This car is currently approved and available for booking
                      </p>
                    </div>
                  </div>
                )}

                {car?.totalRides > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FaCar className="text-blue-600 w-4 h-4" />
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">
                          This car has completed {car.totalRides} ride
                          {car.totalRides !== 1 ? "s" : ""}
                        </span>
                        {car.totalEarnings && (
                          <span>
                            {" "}
                            and earned ₹{car.totalEarnings.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Delete Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCar}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <FaTrash />
                        <span>Delete Car Permanently</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // ✅ EXISTING ADD/EDIT FORM (keep all existing form code)
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Car Image Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaImage className="inline mr-2" />
                    Car Image *
                  </label>

                  {/* ✅ FIXED: Image Preview with better loading handling */}
                  {formData.imageUrl && (
                    <div className="mb-4 relative">
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                        {/* ✅ FIXED: Actual Image - Remove the Date.now() from key as it prevents caching */}
                        <img
                          key={formData.imageUrl} // Simple key without timestamp
                          src={formData.imageUrl}
                          alt="Car preview"
                          className="w-full h-full object-contain bg-white transition-opacity duration-300"
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                          style={{
                            display: "block",
                            opacity: imageLoaded ? 1 : 0, // Smooth transition
                          }}
                        />

                        {/* ✅ FIXED: Loading overlay - only show when image is loading */}
                        {!imageLoaded && !imageError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                            <div className="flex flex-col items-center">
                              <FaSpinner className="animate-spin text-gray-400 text-2xl mb-2" />
                              <span className="text-gray-500 text-sm">
                                Loading image...
                              </span>
                            </div>
                          </div>
                        )}

                        {/* ✅ FIXED: Error overlay */}
                        {imageError && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                            <FaImage className="text-gray-400 text-4xl mb-2" />
                            <span className="text-gray-500 text-sm mb-2">
                              Failed to load image
                            </span>
                            <button
                              type="button"
                              onClick={handleImageRetry}
                              className="text-blue-600 text-sm hover:underline"
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-30"
                        title="Remove image"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="car-image-upload"
                      disabled={isSubmitting || imageUploading}
                    />
                    <label
                      htmlFor="car-image-upload"
                      className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        errors.imageUrl
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      } ${
                        isSubmitting || imageUploading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {imageUploading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          <span className="text-gray-600">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FaUpload className="mr-2 text-gray-400" />
                          <span className="text-gray-600">
                            {formData.imageUrl
                              ? "Change Image"
                              : "Upload Car Image"}
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  {errors.imageUrl && (
                    <p className="text-sm text-red-600">{errors.imageUrl}</p>
                  )}

                  <p className="text-xs text-gray-500">
                    Upload a clear, high-quality image of your car. PNG, JPG,
                    JPEG up to 5MB.
                  </p>
                </div>

                {/* Basic Car Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Car Brand */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Car Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur} // ✅ ADD: Blur validation
                      placeholder="e.g., Maruti Suzuki"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.brand
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.brand && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.brand}
                      </p>
                    )}
                  </div>

                  {/* Car Model */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Car Model *
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur} // ✅ ADD: Blur validation
                      placeholder="e.g., Swift"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.model
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.model && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.model}
                      </p>
                    )}
                  </div>

                  {/* Manufacturing Year */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Manufacturing Year *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur} // ✅ ADD: Blur validation
                      min="2015"
                      max={new Date().getFullYear() + 1}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.year
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="2020"
                      disabled={isSubmitting}
                    />
                    {errors.year && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.year}
                      </p>
                    )}
                  </div>

                  {/* License Plate */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      License Plate Number *
                    </label>
                    <input
                      type="text"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur} // ✅ ADD: Blur validation
                      placeholder="e.g., MH01AB1234"
                      maxLength="15"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.licensePlate
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.licensePlate && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.licensePlate}
                      </p>
                    )}
                  </div>

                  {/* City Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur} // ✅ ADD: Blur validation
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.city
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    >
                      <option value="">Select your city</option>
                      {INDIAN_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Price Per Day */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price Per Day (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="text"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur} // ✅ ADD: Blur validation
                        placeholder="1500"
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.pricePerDay
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.pricePerDay && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.pricePerDay}
                      </p>
                    )}
                  </div>

                  {/* Price Per KM */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price Per KM (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="text"
                        name="pricePerKm"
                        value={formData.pricePerKm}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur} // ✅ ADD: Blur validation
                        placeholder="12"
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.pricePerKm
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.pricePerKm && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.pricePerKm}
                      </p>
                    )}
                  </div>
                </div>

                {/* ✅ IMPROVED: Information Note for Add/Edit modes */}
                <div
                  className={`border rounded-lg p-4 ${
                    isEditMode
                      ? "bg-orange-50 border-orange-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                        isEditMode ? "bg-orange-600" : "bg-blue-600"
                      }`}
                    >
                      <span className="text-white text-xs font-bold">
                        {isEditMode ? "⚠" : "i"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`text-sm font-semibold mb-2 ${
                          isEditMode ? "text-orange-900" : "text-blue-900"
                        }`}
                      >
                        {isEditMode
                          ? "Update Information"
                          : "Important Information"}
                      </h4>
                      <ul
                        className={`text-sm space-y-1.5 ${
                          isEditMode ? "text-orange-800" : "text-blue-800"
                        }`}
                      >
                        {isEditMode ? (
                          <>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1 text-xs">•</span>
                              <span>
                                Your car will be submitted for re-approval after
                                updating
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1 text-xs">•</span>
                              <span>
                                Existing active bookings will not be affected
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1 text-xs">•</span>
                              <span>
                                New bookings will use the updated pricing and
                                details
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1 text-xs">•</span>
                              <span>
                                Car may become temporarily unavailable during
                                review
                              </span>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1 text-xs">•</span>
                              <span>
                                Your car will be reviewed by our admin team
                                before approval
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1 text-xs">•</span>
                              <span>
                                Once approved, customers can book your car
                                immediately
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1 text-xs">•</span>
                              <span>
                                You can update pricing and availability anytime
                                from dashboard
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1 text-xs">•</span>
                              <span>
                                Ensure all details are accurate to avoid
                                approval delays
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1 text-xs">•</span>
                              <span>
                                High-quality images increase booking chances
                              </span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* ✅ FIXED: Sticky Form Actions */}
                <div
                  className="sticky bottom-0 bg-white flex justify-end space-x-4 pt-6 border-t border-gray-200"
                  style={{ zIndex: 53 }}
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || imageUploading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>
                          {isEditMode ? "Updating..." : "Adding Car..."}
                        </span>
                      </>
                    ) : (
                      <>
                        {isEditMode ? <FaSave /> : <FaPlus />}
                        <span>{isEditMode ? "Update Car" : "Add Car"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCarModal;
