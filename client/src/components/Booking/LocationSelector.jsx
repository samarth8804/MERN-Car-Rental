import React, { useState, useEffect, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaSpinner,
  FaCrosshairs,
  FaSearch,
  FaCheckCircle,
  FaGlobe,
  FaKeyboard,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import locationService from "../../utils/locationService";

const LocationSelector = ({
  label,
  icon: Icon,
  iconColor,
  placeholder,
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value.address || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Keep input in sync with value.address unless typing
  useEffect(() => {
    if (!isTyping) {
      setInputValue(value.address || "");
    }
  }, [value.address, isTyping]);

  // Debounced search for suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (inputValue.trim().length > 2 && isTyping) {
      setIsLoading(true);
      debounceRef.current = setTimeout(() => {
        searchLocations(inputValue.trim());
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setHasSearched(false);
      setIsLoading(false);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, isTyping]);

  const searchLocations = async (query) => {
    
    try {
      const results = await locationService.searchPlaces(query);
      
      setSuggestions(results);
      setShowSuggestions(true);
      setHasSearched(true);
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions(true);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Suggestion click handler
  const handleSuggestionClick = (suggestion) => {
    setIsTyping(false);
    setShowSuggestions(false);
    setInputValue(suggestion.address);

    const locationData = {
      address: suggestion.address,
      coordinates: {
        latitude: Number(suggestion.coordinates.latitude),
        longitude: Number(suggestion.coordinates.longitude),
      },
      placeId: suggestion.placeId,
      name: suggestion.mainText,
      source: "openstreetmap",
      isCurrentLocation: false,
    };

    onChange(locationData);
    toast.success("Location selected!");
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    setIsTyping(false);

    try {
      const currentLocation = await locationService.getCurrentLocation();
      const locationDetails = await locationService.reverseGeocode(
        currentLocation.latitude,
        currentLocation.longitude
      );

      const locationData = {
        address: locationDetails.address, // always a resolved address
        coordinates: {
          latitude: Number(currentLocation.latitude),
          longitude: Number(currentLocation.longitude),
        },
        placeId: locationDetails.placeId,
        name: locationDetails.address.split(",")[0],
        isCurrentLocation: true,
        source: "geolocation",
      };

      setInputValue(locationDetails.address);
      onChange(locationData);
      toast.success("Current location detected!");
    } catch (error) {
      // ...error handling...
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Manual input handler
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTyping(true);
    setHasSearched(false);

    // Only clear location data if input is completely empty
    if (!newValue.trim()) {
      setIsTyping(false);
      onChange({
        address: "",
        coordinates: { latitude: null, longitude: null },
        placeId: null,
        name: "",
        source: "",
        isCurrentLocation: false,
      });
    }
  };

  // Manual entry (when user presses Enter or clicks "Use as address")
  const handleManualEntry = () => {
    if (inputValue.trim() && inputValue.trim() !== value.address) {
      const manualLocation = locationService.createManualLocation(
        inputValue.trim()
      );
      onChange(manualLocation);
      toast.success(
        "Manual address entered - you can pin exact location on map"
      );
    }
  };

  // Enter key handler
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      } else if (hasSearched) {
        handleManualEntry();
      }
      setShowSuggestions(false);
      setIsTyping(false);
    }
  };

  // Blur handler
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      if (
        isTyping &&
        inputValue.trim() &&
        inputValue.trim() !== value.address &&
        suggestions.length === 0
      ) {
        handleManualEntry();
      }
      setIsTyping(false);
    }, 200);
  };

  const handleInputFocus = () => {
    setIsTyping(true);
    if (inputValue.trim().length > 2) {
      searchLocations(inputValue.trim());
    }
  };

  // Location set logic
  const isLocationSet =
    value.address && value.address.trim() !== "" && !isTyping;

  const hasValidCoordinates =
    value.coordinates?.latitude != null && value.coordinates?.longitude != null;

  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-gray-700">
        <Icon className={`inline mr-2 ${iconColor}`} />
        {label} *
      </label>

      <div className="relative">
        <div className="flex">
          {/* Main Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="off"
            />

            {/* Icons */}
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FaSpinner className="animate-spin text-blue-400" />
              </div>
            )}

            {!isLoading && !isLocationSet && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FaSearch className="text-gray-400" />
              </div>
            )}

            {!isLoading && isLocationSet && hasValidCoordinates && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FaCheckCircle className="text-green-500" />
              </div>
            )}

            {!isLoading && isLocationSet && !hasValidCoordinates && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FaKeyboard
                  className="text-orange-500"
                  title="Manual entry - pin on map for exact location"
                />
              </div>
            )}
          </div>

          {/* Current Location Button */}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]"
            title="Use current location"
          >
            {isGettingLocation ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaCrosshairs />
            )}
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && isTyping && (
        <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center">
              <FaSpinner className="animate-spin mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          )}

          {!isLoading && suggestions.length > 0 && (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id || index}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(suggestion);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-start space-x-3"
                >
                  <FaMapMarkerAlt className="text-gray-400 text-sm mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.mainText}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {suggestion.secondaryText}
                    </p>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Only show manual entry if no suggestions and search was performed */}
          {!isLoading &&
            suggestions.length === 0 &&
            hasSearched &&
            inputValue.trim().length > 2 && (
              <div className="p-4">
                <div className="text-center text-gray-500 mb-3">
                  <FaSearch className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No locations found</p>
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleManualEntry();
                    setShowSuggestions(false);
                  }}
                  className="w-full p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm flex items-center justify-center space-x-2"
                >
                  <FaKeyboard />
                  <span>Use "{inputValue.trim()}" as address</span>
                </button>
              </div>
            )}
        </div>
      )}

      {/* Location confirmation */}
      {isLocationSet && (
        <div
          className={`border rounded-lg p-2 ${
            hasValidCoordinates
              ? "bg-green-50 border-green-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <div className="flex items-start space-x-2">
            {hasValidCoordinates ? (
              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <FaKeyboard className="text-orange-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs font-medium ${
                  hasValidCoordinates ? "text-green-800" : "text-orange-800"
                }`}
              >
                {hasValidCoordinates
                  ? "Location confirmed"
                  : "Manual address entered"}
              </p>
              <p
                className={`text-xs truncate ${
                  hasValidCoordinates ? "text-green-600" : "text-orange-600"
                }`}
              >
                {value.address}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {value.isCurrentLocation && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                    Current Location
                  </span>
                )}
                <span
                  className={`inline-flex items-center space-x-1 text-xs px-2 py-0.5 rounded ${
                    hasValidCoordinates
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  <FaGlobe className="w-3 h-3" />
                  <span>
                    {value.source === "map_click"
                      ? "Map Pin"
                      : value.source === "geolocation"
                      ? "GPS"
                      : value.source === "manual"
                      ? "Manual"
                      : "OpenStreetMap"}
                  </span>
                </span>
              </div>
              {!hasValidCoordinates && (
                <p className="text-xs text-orange-600 mt-1">
                  💡 Pin exact location on the map below for precise coordinates
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Type address, use GPS, or click map below. Press Enter to use manual
        address.
      </p>
    </div>
  );
};

export default LocationSelector;
