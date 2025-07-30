import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import CarsCard from "../Cards/CarsCard";
import CitySelector from "../common/CitySelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const FeaturedCars = ({ onOpenRoleModal }) => {
  const [cars, setCars] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cars based on city - FIXED API CALL
  const fetchCars = async (city = "") => {
    try {
      setLoading(true);
      setError(null);

      let url;
      if (city) {
        // Use the correct API path for city-specific cars
        url = API_PATHS.CAR.GET_CARS_BY_CITY(city);
      } else {
        // Use customer endpoint for all available cars
        url = API_PATHS.CUSTOMER.GET_AVAILABLE_CARS;
      }


      const response = await axiosInstance.get(url);

      if (response.data.success) {
        // Handle different response structures
        const carsData = response.data.cars || response.data.data || [];
        setCars(carsData);
      } else {
        setCars([]);
        setError(response.data.message || "Failed to fetch cars");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
      setError("Failed to load cars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCars();
  }, []);

  // Handle city change - FIXED to prevent navigation
  const handleCityChange = async (city) => {
    

    // Prevent any default navigation behavior
    try {
      await fetchCars(city);
    } catch (error) {
      console.error("Error in handleCityChange:", error);
    }
  };

  // Handle book car action
  const handleBookCar = (car) => {
    console.log("Booking car:", car);
    onOpenRoleModal("signup");
  };

  // Handle see all cars
  const handleSeeAllCars = () => {
    // You can either open a modal or navigate to cars page
    onOpenRoleModal("signup"); // For now, open signup modal
    // Or you could navigate: navigate('/cars');
  };

  // Error state component
  if (error && !loading) {
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

          {/* City Selector */}
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-lg">
              <CitySelector
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
                className=""
                size="lg"
                variant="gradient"
                showAllOption={true}
                placeholder="Choose Your City"
              />
            </div>
          </div>

          {/* Error State */}
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto mb-6 shadow-lg">
              <div className="text-6xl mb-4">⚠️</div>
              <div className="text-red-800 text-xl font-semibold mb-2">
                Unable to load vehicles
              </div>
              <div className="text-red-600 text-sm mb-6">
                {error || "Please check your connection and try again"}
              </div>
              <button
                onClick={() => fetchCars(selectedCity)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Get featured cars (first 6)
  const featuredCars = cars.slice(0, 6);
  const hasMoreCars = cars.length > 6;

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

        {/* City Selector */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-lg">
            <CitySelector
              selectedCity={selectedCity}
              onCityChange={handleCityChange}
              className=""
              size="lg"
              variant="gradient"
              showAllOption={true}
              placeholder="All Cities"
            />
          </div>
        </div>

        {/* Results Info - Enhanced with total count */}
        <div className="text-center mb-8">
          {loading ? (
            <div className="text-gray-600 text-lg flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span>Loading cars...</span>
            </div>
          ) : (
            <div className="text-gray-600 text-lg">
              Showing{" "}
              <span className="font-semibold text-blue-600">
                {Math.min(cars.length, 6)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-blue-600">{cars.length}</span>{" "}
              cars
              {selectedCity && (
                <span className="text-blue-600 font-medium">
                  {" "}
                  in {selectedCity}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">
                Loading amazing cars for you...
              </p>
            </div>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
              <div className="text-6xl mb-4">🚗</div>
              <div className="text-gray-800 text-xl font-semibold mb-2">
                No cars available
              </div>
              <div className="text-gray-600 text-sm mb-6">
                {selectedCity
                  ? `No cars found in ${selectedCity}. Try selecting a different city.`
                  : "No cars are currently available for rent."}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {selectedCity && (
                  <button
                    onClick={() => handleCityChange("")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    View All Cities
                  </button>
                )}
                <button
                  onClick={() => onOpenRoleModal("signup")}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  List Your Car
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Cars Grid - Always show max 6 cars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <CarsCard
                  key={car._id}
                  car={car}
                  onBookClick={() => handleBookCar(car)}
                  buttonText="Book Now"
                  showBookButton={true}
                />
              ))}
            </div>

            {/* See All Cars Section - Enhanced Design */}
            {hasMoreCars && (
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
                  <div className="text-4xl mb-4">🚗✨</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Discover More Amazing Cars
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We have{" "}
                    <span className="font-semibold text-blue-600">
                      {cars.length - 6} more cars
                    </span>{" "}
                    waiting for you
                    {selectedCity && ` in ${selectedCity}`}. Find your perfect
                    ride!
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleSeeAllCars}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>View All {cars.length} Cars</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => onOpenRoleModal("signup")}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      List Your Car
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Alternative: Simple See All Button */}
            {/* {hasMoreCars && (
              <div className="text-center mt-12">
                <button
                  onClick={handleSeeAllCars}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  See All Cars ({cars.length})
                </button>
              </div>
            )} */}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;
