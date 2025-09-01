/**
 * Ensures image URLs use HTTPS in production environments
 * @param {string} url - The original image URL
 * @returns {string} - The secure image URL
 */
export const getSecureImageUrl = (url) => {
  if (!url) return "";

  // In production (Vercel), convert http:// to https://
  if (window.location.protocol === "https:" && url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  return url;
};
