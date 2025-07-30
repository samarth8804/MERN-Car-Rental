import { API_PATHS } from "./apiPaths";

class LocationService {
  constructor() {
    this.cache = new Map();
  }

  async searchPlaces(query) {
    if (!query || query.trim().length < 3) return [];

    const cacheKey = query.toLowerCase().trim();
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    try {
      const response = await fetch(
        `/${API_PATHS.LOCATION.SEARCH}?q=${encodeURIComponent(query.trim())}`
      );
      if (!response.ok) return [];

      const data = await response.json();


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
      return [];
    }
  }

  async reverseGeocode(lat, lon) {
    try {
      const response = await fetch(
        `/${API_PATHS.LOCATION.REVERSE}?lat=${lat}&lon=${lon}`
      );
      if (!response.ok) throw new Error("Reverse geocode failed");
      const data = await response.json();
      return {
        address: data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        placeId: data.place_id,
      };
    } catch (error) {
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
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
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
