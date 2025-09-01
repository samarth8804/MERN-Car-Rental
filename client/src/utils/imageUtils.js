/**
 * Ensures image URLs use HTTPS in production and handles localhost URLs
 * @param {string} url - The original image URL
 * @returns {string} - The secure image URL
 */
export const getSecureImageUrl = (url) => {
  if (!url) return "";

  // 1. Handle localhost URLs in production
  if (window.location.hostname !== "localhost" && url.includes("localhost")) {
    // Replace localhost URL with deployed backend URL
    return url.replace(
      /https?:\/\/localhost:3000/,
      import.meta.env.VITE_API_BASE_URL
    );
  }

  // 2. In production (Vercel), convert http:// to https://
  if (window.location.protocol === "https:" && url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  return url;
};
