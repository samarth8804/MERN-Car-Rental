import { FaSearch, FaTimes } from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";
import CitySelector from "../common/CitySelector";
import DateFilterSection from "./DateFilterSection";
import CarsGrid from "./CarsGrid";
import { formatDateIndian } from "../../utils/dashboard/dateUtils";

const CarsTab = ({
  dateFilters,
  filteredCars,
  selectedCity,
  searchTerm,
  loading,
  onDateFilterChange,
  onClearDateFilters,
  onCityChange,
  onSearchChange,
  onBookCar,
}) => {
  // ✅ FIXED: Clear search function
  const handleClearSearch = () => {
    onSearchChange("");
  };

  // ✅ FIXED: Clear city filter function
  const handleClearCity = () => {
    onCityChange("");
  };

  // ✅ IMPROVED: Empty cars state with better messaging
  if (!loading && filteredCars.length === 0) {
    return (
      <div className="space-y-6">
        {/* Date Filter */}
        <DateFilterSection
          dateFilters={dateFilters}
          onDateFilterChange={onDateFilterChange}
          onClearDateFilters={onClearDateFilters}
        />

        {/* City and Search Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <CitySelector
              selectedCity={selectedCity}
              onCityChange={onCityChange}
              size="md"
              showAllOption={true}
              placeholder="Filter by City"
            />
          </div>

          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cars by brand, model..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              {/* ✅ Clear search button */}
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Enhanced empty state message */}
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="text-center max-w-md">
            <MdDirectionsCar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              {searchTerm ? "No Matching Cars" : "No Cars Available"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No cars match "${searchTerm}". Try different keywords or check spelling.`
                : dateFilters.isDateFilterActive
                ? `No cars available for ${formatDateIndian(
                    dateFilters.startDate
                  )} to ${formatDateIndian(dateFilters.endDate)}.`
                : selectedCity
                ? `No cars available in ${selectedCity}.`
                : "No approved cars are currently available."}
            </p>

            {/* ✅ Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
              {dateFilters.isDateFilterActive && (
                <button
                  onClick={onClearDateFilters}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Date Filters
                </button>
              )}
              {selectedCity && (
                <button
                  onClick={handleClearCity}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Show All Cities
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Cars</h2>
            <p className="text-gray-600 mt-1">
              {dateFilters.isDateFilterActive
                ? `Available from ${formatDateIndian(
                    dateFilters.startDate
                  )} to ${formatDateIndian(dateFilters.endDate)}`
                : "Find and book your perfect ride"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-sm text-gray-500">
            {filteredCars.length} cars
            {selectedCity && ` in ${selectedCity}`}
            {searchTerm && ` matching "${searchTerm}"`}
            {dateFilters.isDateFilterActive && (
              <span className="text-blue-600 font-medium ml-2">
                • Date filtered
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Date Filter */}
        <DateFilterSection
          dateFilters={dateFilters}
          onDateFilterChange={onDateFilterChange}
          onClearDateFilters={onClearDateFilters}
        />

        {/* City and Search Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <CitySelector
              selectedCity={selectedCity}
              onCityChange={onCityChange}
              size="md"
              showAllOption={true}
              placeholder="Filter by City"
            />
          </div>

          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cars by brand, model, license plate..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              {/* ✅ Clear search button */}
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Active filters display */}
        {(searchTerm || selectedCity || dateFilters.isDateFilterActive) && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                <span>Search: "{searchTerm}"</span>
                <button
                  onClick={handleClearSearch}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            )}
            {selectedCity && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                <span>City: {selectedCity}</span>
                <button
                  onClick={handleClearCity}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            )}
            {dateFilters.isDateFilterActive && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                <span>
                  Dates: {formatDateIndian(dateFilters.startDate)} -{" "}
                  {formatDateIndian(dateFilters.endDate)}
                </span>
                <button
                  onClick={onClearDateFilters}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cars Grid */}
      <CarsGrid
        loading={loading}
        filteredCars={filteredCars}
        dateFilters={dateFilters}
        selectedCity={selectedCity}
        onBookCar={onBookCar}
        onClearDateFilters={onClearDateFilters}
        onCityChange={onCityChange}
      />
    </div>
  );
};

export default CarsTab;
