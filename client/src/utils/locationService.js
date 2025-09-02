import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

class LocationService {
  constructor() {
    this.cache = new Map();
  }

  async searchPlaces(query) {
    if (!query || query.trim().length < 3) return [];

    const cacheKey = query.toLowerCase().trim();
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    try {
      // Use axiosInstance with the full path (not a relative URL)
      const response = await axiosInstance.get(
        `${API_PATHS.LOCATION.SEARCH}?q=${encodeURIComponent(query.trim())}`
      );

      const data = response.data;
      console.log("Place search results:", data);

      const results = Array.isArray(data)
        ? data.map((item, idx) => ({
            id: item.place_id || `${item.lat}-${item.lon}-${idx}`,
            placeId: item.place_id,
            address: item.display_name,
            mainText: item.display_name.split(",")[0].trim(),
            secondaryText: item.display_name
              .split(",")
              .slice(1)
              .join(", ")
              .trim(),
            coordinates: {
              latitude: parseFloat(item.lat),
              longitude: parseFloat(item.lon),
            },
            source: "openstreetmap",
          }))
        : [];

      this.cache.set(cacheKey, results);
      setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);

      return results;
    } catch (error) {
      console.error("Error searching places:", error);
      return [];
    }
  }

  async reverseGeocode(lat, lon) {
    try {
      // Use axiosInstance with the full path (not a relative URL)
      const response = await axiosInstance.get(
        `${API_PATHS.LOCATION.REVERSE}?lat=${lat}&lon=${lon}`
      );

      const data = response.data;
      return {
        address: data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        placeId: data.place_id,
      };
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return {
        address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        placeId: null,
      };
    }
  }

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            // Get address from coordinates
            const addressInfo = await this.reverseGeocode(
              coords.latitude,
              coords.longitude
            );

            resolve({
              ...coords,
              address: addressInfo.address,
              placeId: addressInfo.placeId,
            });
          } catch (error) {
            console.error("Error getting location details:", error);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: `${position.coords.latitude.toFixed(
                4
              )}, ${position.coords.longitude.toFixed(4)}`,
              placeId: null,
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000,
        }
      );
    });
  }

  createManualLocation(address, coordinates = null) {
    return {
      address: address.trim(),
      coordinates: coordinates || { latitude: null, longitude: null },
      placeId: null,
      name: address.split(",")[0].trim(),
      source: "manual",
      isCurrentLocation: false,
    };
  }
}

const locationService = new LocationService();
export default locationService;
