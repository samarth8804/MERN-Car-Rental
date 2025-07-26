import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaChevronDown,
  FaSpinner,
  FaGlobe,
  FaLocationArrow,
  FaExclamationTriangle,
  FaSync,
  FaCity,
  FaBuilding,
  FaHome,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CitySelector = ({
  selectedCity,
  onCityChange,
  className = "",
  placeholder = "Select City",
  showAllOption = true,
  disabled = false,
  size = "md",
  variant = "default",
}) => {
  const [cities, setCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(API_PATHS.CAR.GET_CITIES);

      if (response.data.success) {
        setCities(response.data.data || []);
      } else {
        setError("Failed to load cities");
        setCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setError("Failed to load cities");
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    onCityChange(city);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && !event.target.closest(".city-selector")) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Filter cities based on search term
  const filteredCities = cities.filter((city) =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "px-4 py-3 text-sm",
      icon: "text-sm",
      dropdown: "text-sm",
    },
    md: {
      button: "px-6 py-4 text-base",
      icon: "text-lg",
      dropdown: "text-base",
    },
    lg: {
      button: "px-8 py-5 text-lg",
      icon: "text-xl",
      dropdown: "text-lg",
    },
  };

  const config = sizeConfig[size];

  // Button styling based on variant
  const getButtonStyles = () => {
    const baseStyles = `w-full flex items-center justify-between rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 border-2 ${config.button}`;

    if (disabled) {
      return `${baseStyles} bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed`;
    }

    if (error) {
      return `${baseStyles} bg-white border-red-300 text-gray-700 hover:border-red-400 focus:ring-red-100 focus:border-red-500`;
    }

    switch (variant) {
      case "gradient":
        return `${baseStyles} bg-gradient-to-r from-blue-500 to-purple-600 border-transparent text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105`;
      case "outline":
        return `${baseStyles} bg-white border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-100 shadow-md hover:shadow-lg`;
      default:
        return `${baseStyles} bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:shadow-lg focus:ring-blue-100 focus:border-blue-500 ${
          isOpen ? "border-blue-500 shadow-lg ring-4 ring-blue-100" : ""
        }`;
    }
  };

  // Get city icon based on city name or use default
  const getCityIcon = (cityName) => {
    const cityIconMap = {
      Delhi: FaBuilding,
      Mumbai: FaCity,
      Bangalore: FaBuilding,
      Chennai: FaCity,
      Kolkata: FaBuilding,
      Hyderabad: FaCity,
      Pune: FaBuilding,
      Ahmedabad: FaCity,
      default: FaHome,
    };

    const IconComponent = cityIconMap[cityName] || cityIconMap.default;
    return IconComponent;
  };

  return (
    <div className={`relative city-selector ${className}`}>
      {/* Main Selection Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || loading}
        className={getButtonStyles()}
      >
        <div className="flex items-center space-x-4">
          {/* Enhanced Icon with City Image */}
          <div
            className={`relative p-4 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
              variant === "gradient"
                ? "bg-white/20 text-white shadow-white/20"
                : selectedCity
                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-blue-200"
                : error
                ? "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-red-200"
                : "bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-gray-200"
            }`}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent animate-pulse"></div>
            </div>

            {selectedCity ? (
              React.createElement(getCityIcon(selectedCity), {
                className: `${config.icon} relative z-10 drop-shadow-sm`,
              })
            ) : (
              <FaMapMarkerAlt
                className={`${config.icon} relative z-10 drop-shadow-sm`}
              />
            )}
          </div>

          {/* Text Content */}
          <div className="text-left flex-1">
            <div
              className={`font-semibold ${
                variant === "gradient"
                  ? "text-white"
                  : selectedCity
                  ? "text-gray-900"
                  : "text-gray-500"
              }`}
            >
              {loading
                ? "Loading cities..."
                : error
                ? "Select city"
                : selectedCity || placeholder}
            </div>
          </div>
        </div>

        {/* Dropdown Arrow */}
        <div
          className={`${
            variant === "gradient" ? "text-white" : "text-gray-400"
          }`}
        >
          {loading ? (
            <FaSpinner className={`animate-spin ${config.icon}`} />
          ) : error ? (
            <FaExclamationTriangle className={`text-red-500 ${config.icon}`} />
          ) : (
            <FaChevronDown
              className={`transition-transform duration-300 ${config.icon} ${
                isOpen ? "rotate-180 text-blue-500" : ""
              }`}
            />
          )}
        </div>
      </button>

      {/* Enhanced Dropdown Menu */}
      {isOpen && !loading && !error && (
        <div className="absolute z-50 w-full min-w-[400px] mt-3 bg-white border-2 border-gray-100 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Search Bar */}
          {cities.length > 6 && (
            <div className="p-5 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                  <FaLocationArrow className="text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Cities List */}
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
            {/* All Cities Option */}
            {showAllOption && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCitySelect("");
                }}
                className={`w-full p-5 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100 group ${
                  !selectedCity
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <FaGlobe className="text-lg text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div
                        className={`font-semibold text-lg ${
                          !selectedCity
                            ? "text-blue-700"
                            : "text-gray-900 group-hover:text-blue-700"
                        }`}
                      >
                        All Cities
                      </div>
                    </div>
                  </div>
                  {!selectedCity && (
                    <div className="text-blue-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </button>
            )}

            {/* Individual Cities */}
            {filteredCities.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="bg-gray-50 rounded-2xl p-6 inline-block">
                  <FaCity className="text-4xl mx-auto mb-3 text-gray-300" />
                  <div className="font-medium text-gray-600 mb-1">
                    No cities found
                  </div>
                  <div className="text-sm">Try a different search term</div>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredCities.map((cityData) => (
                  <button
                    key={cityData.city}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCitySelect(cityData.city);
                    }}
                    className={`w-full p-5 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group ${
                      selectedCity === cityData.city
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          <FaMapMarkerAlt className="text-lg text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-semibold text-lg ${
                              selectedCity === cityData.city
                                ? "text-blue-700"
                                : "text-gray-900 group-hover:text-blue-700"
                            }`}
                          >
                            {cityData.city}
                          </div>
                        </div>
                      </div>
                      {selectedCity === cityData.city && (
                        <div className="text-blue-600">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && isOpen && (
        <div className="absolute z-50 w-full min-w-[400px] mt-3 bg-white border-2 border-red-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 mb-4">
              <div className="relative inline-block p-3 bg-red-100 rounded-full mb-3">
                <FaExclamationTriangle className="text-2xl text-red-500" />
              </div>
              <div className="text-red-700 font-semibold mb-2 text-lg">
                Unable to Load Cities
              </div>
              <div className="text-red-600 text-sm">
                Please check your connection and try again
              </div>
            </div>
            <button
              onClick={fetchCities}
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaSync className="text-sm" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
