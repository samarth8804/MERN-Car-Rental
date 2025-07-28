import { FaCar, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import CarsCard from "../Cards/CarsCard";

const CarsGrid = ({
  loading,
  filteredCars,
  dateFilters,
  selectedCity,
  onBookCar,
  onClearDateFilters,
  onCityChange,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {dateFilters.isDateFilterActive
              ? "Checking availability..."
              : "Loading cars..."}
          </p>
        </div>
      </div>
    );
  }

  // Check if no cars due to invalid date range
  const hasInvalidDateRange =
    dateFilters.startDate &&
    dateFilters.endDate &&
    !dateFilters.isDateFilterActive;

  if (filteredCars.length === 0) {
    return (
      <div className="text-center py-20">
        {hasInvalidDateRange ? (
          // Show error state for invalid date ranges
          <>
            <FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Invalid Date Range
            </h3>
            <p className="text-gray-500 mb-4">
              Please select a valid date range to view available cars.
              <br />
              <span className="text-sm text-gray-400">
                Maximum rental period is 30 days.
              </span>
            </p>
            <button
              onClick={onClearDateFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Clear Date Filters
            </button>
          </>
        ) : (
          // Show normal no cars available state
          <>
            <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No cars available
            </h3>
            <p className="text-gray-500 mb-4">
              {dateFilters.isDateFilterActive
                ? `No cars available${
                    selectedCity ? ` in ${selectedCity}` : ""
                  } for selected dates`
                : selectedCity
                ? `No cars found in ${selectedCity}`
                : "No cars match your search"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {dateFilters.isDateFilterActive && (
                <button
                  onClick={onClearDateFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Try Different Dates
                </button>
              )}
              {selectedCity && (
                <button
                  onClick={() => onCityChange("")}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  View All Cities
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCars.map((car) => (
        <CarsCard
          key={car._id}
          car={car}
          onBookClick={() => onBookCar(car)}
          buttonText={
            dateFilters.isDateFilterActive
              ? "Book for Selected Dates"
              : "Book Now"
          }
          showBookButton={true}
        />
      ))}
    </div>
  );
};

export default CarsGrid;
