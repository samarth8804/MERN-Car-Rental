/**
 * Ensures image URLs are properly handled
 * @param {string} url - The original image URL
 * @returns {string} - The processed image URL
 */
export const getSecureImageUrl = (url) => {
  if (!url) return "";

  // Cloudinary URLs are already secure
  if (url.includes("cloudinary.com")) {
    return url;
  }

  // For non-Cloudinary URLs, use the existing logic
  if (window.location.hostname !== "localhost" && url.includes("localhost")) {
    return url.replace(
      /http:\/\/localhost:3000/g,
      import.meta.env.VITE_API_BASE_URL
    );
  }

  // Convert HTTP to HTTPS if needed
  if (window.location.protocol === "https:" && url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  return url;
};
