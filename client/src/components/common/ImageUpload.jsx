import React, { useRef, useState, useEffect } from "react";
import {
  FaUpload,
  FaTimes,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { getSecureImageUrl } from "../../utils/imageUtils";

const ImageUpload = ({ currentImage, onImageUpload, uploading, error }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Set up preview when currentImage changes
  useEffect(() => {
    if (currentImage) {
      // If it's a Cloudinary URL or regular URL, use getSecureImageUrl
      if (typeof currentImage === "string") {
        setPreview(getSecureImageUrl(currentImage));

        // Preload the image to check if it loads properly
        const img = new Image();
        img.src = getSecureImageUrl(currentImage);
        img.onload = () => setImageLoaded(true);
        img.onerror = () =>
          console.error("Failed to load image:", currentImage);
      }
      // If it's a File object (from local selection)
      else if (currentImage instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
          setImageLoaded(true);
        };
        reader.readAsDataURL(currentImage);
      }
    } else {
      setPreview(null);
      setImageLoaded(false);
    }
  }, [currentImage]);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB");
      return;
    }

    // Create preview immediately for better UX
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setImageLoaded(true);
    };
    reader.readAsDataURL(file);

    // Upload file to Cloudinary via parent component
    onImageUpload(file);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearImage = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setPreview(null);
    setImageLoaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Notify parent that image was cleared
    onImageUpload(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 bg-gray-50"
        } ${uploading ? "pointer-events-none" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && !preview && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="text-center">
            <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto mb-4" />
            <p className="text-blue-600 font-medium">
              Uploading to Cloudinary...
            </p>
            <p className="text-sm text-blue-500">This may take a moment</p>
          </div>
        ) : preview ? (
          <div className="relative">
            {/* Image with loading state */}
            <div className="relative h-48">
              <img
                src={preview}
                alt="Car preview"
                className={`w-full h-full object-contain bg-white transition-opacity duration-300 rounded-lg ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
              />

              {/* Loading overlay */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <FaSpinner className="animate-spin text-3xl text-blue-600" />
                </div>
              )}
            </div>

            {/* Delete button */}
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <FaUpload className="text-3xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center text-sm text-red-600">
          <FaExclamationCircle className="mr-2" />
          <p>
            {typeof error === "string"
              ? error
              : "Failed to upload image. Please try again."}
          </p>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        * Upload a clear, high-quality image of your car. This will be the main
        image customers see.
      </p>
    </div>
  );
};

export default ImageUpload;
