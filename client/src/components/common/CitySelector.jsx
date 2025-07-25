import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CitySelector = ({ selectedCity, onCityChange, className = "" }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailableCities();
  }, []);

  const fetchAvailableCities = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.CAR.GET_CITIES);
      setCities(response.data.data || []);
      setError("");
    } catch (error) {
      console.error("Error fetching cities:", error);
      setError("Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return <div className={`text-red-500 text-sm ${className}`}>{error}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-gray-900 font-medium"
      >
        <option value="">🏙️ Select Your City</option>
        {cities.map((cityData) => (
          <option key={cityData.city} value={cityData.city}>
            {cityData.city} ({cityData.availableCars} cars available)
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default CitySelector;
