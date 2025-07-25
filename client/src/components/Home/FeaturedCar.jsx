import { useState, useEffect } from "react";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import CarsCard from "../Cards/CarsCard";
import CitySelector from "../common/CitySelector"; // ✅ ADD CITY SELECTOR
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const FeaturedCars = ({ onOpenRoleModal }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(""); // ✅ ADD CITY STATE

  // Fetch cars from backend using axios instance
  const fetchCars = async (city = "") => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching cars using axios instance...");

      // ✅ USE CITY FILTER IF SELECTED
      const url = city
        ? `${API_PATHS.CUSTOMER.GET_AVAILABLE_CARS}?city=${city}`
        : API_PATHS.CUSTOMER.GET_AVAILABLE_CARS;

      console.log("API URL:", url);

      const response = await axiosInstance.get(url);

      console.log("API Response:", response.data);

      if (response.data.success) {
        setCars(response.data.cars || []);
        console.log(
          "Cars loaded successfully:",
          response.data.cars?.length || 0,
          "cars"
        );
      } else {
        setError(response.data.message || "Failed to fetch cars");
      }
    } catch (err) {
      console.error("Error fetching cars:", err);

      // Handle different error types from axios interceptor
      if (err.type === "NETWORK_ERROR") {
        setError(
          "Unable to connect to server. Please check if the backend is running on port 3000."
        );
      } else if (err.type === "TIMEOUT_ERROR") {
        setError("Request timed out. Please try again.");
      } else if (err.type === "HTTP_ERROR") {
        setError(err.message || "Server error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // ✅ HANDLE CITY CHANGE
  const handleCityChange = (city) => {
    setSelectedCity(city);
    fetchCars(city);
  };

  const handleBookClick = (action, car) => {
    onOpenRoleModal(action);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured <span className="text-blue-600">Vehicles</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our premium collection of vehicles available for rent
            </p>
          </div>

          {/* ✅ ADD CITY SELECTOR */}
          <div className="flex justify-center mb-8">
            <CitySelector
              selectedCity={selectedCity}
              onCityChange={handleCityChange}
              className="max-w-md"
            />
          </div>

          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading available cars...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured <span className="text-blue-600">Vehicles</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our premium collection of vehicles available for rent
            </p>
          </div>

          {/* ✅ ADD CITY SELECTOR */}
          <div className="flex justify-center mb-8">
            <CitySelector
              selectedCity={selectedCity}
              onCityChange={handleCityChange}
              className="max-w-md"
            />
          </div>

          <div className="text-center py-20">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto mb-6">
              <div className="text-6xl mb-4">🚗</div>
              <div className="text-gray-800 text-lg font-medium mb-2">
                Unable to load vehicles
              </div>
              <div className="text-gray-600 text-sm mb-6">
                Please check your connection and try again
              </div>
              <button
                onClick={() => fetchCars(selectedCity)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!cars || cars.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured <span className="text-blue-600">Vehicles</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our premium collection of vehicles available for rent
            </p>
          </div>

          {/* ✅ ADD CITY SELECTOR */}
          <div className="flex justify-center mb-8">
            <CitySelector
              selectedCity={selectedCity}
              onCityChange={handleCityChange}
              className="max-w-md"
            />
          </div>

          <div className="text-center py-20">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto mb-6">
              <div className="text-yellow-600 text-lg mb-2">
                📋 No Cars Available
              </div>
              <div className="text-gray-600 text-sm">
                {selectedCity
                  ? `No cars available in ${selectedCity}`
                  : "There are currently no cars available for rent"}
              </div>
            </div>
            <button
              onClick={() => onOpenRoleModal("signup")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Get Started - List Your Car
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show featured cars (limit to first 6)
  const featuredCars = cars.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="text-blue-600">Vehicles</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our premium collection of vehicles available for rent
          </p>
        </div>

        {/* ✅ ADD CITY SELECTOR */}
        <div className="flex justify-center mb-12">
          <CitySelector
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <CarsCard
              key={car._id}
              car={car}
              onBookClick={handleBookClick}
              buttonText="Book Now"
              buttonAction="signup"
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onOpenRoleModal("signup")}
            className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition duration-300 inline-flex items-center space-x-2"
          >
            <span>
              View All Cars ({cars.length} available
              {selectedCity ? ` in ${selectedCity}` : ""})
            </span>
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
