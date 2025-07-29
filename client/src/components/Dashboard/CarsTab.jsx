import { FaSearch } from "react-icons/fa";
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
  // ✅ IMPROVED: Empty cars state
  if (!loading && filteredCars.length === 0) {
    return (
      <div className="space-y-6">
        {/* Keep all the filters and controls */}
        {/* <CarsHeader /> */}
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
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* ✅ Better empty state message */}
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="text-center max-w-md">
            <MdDirectionsCar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              {dateFilters.isDateFilterActive
                ? "No Cars Available"
                : "No Cars Found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {dateFilters.isDateFilterActive
                ? `No cars are available for the selected dates (${new Date(
                    dateFilters.startDate
                  ).toLocaleDateString()} - ${new Date(
                    dateFilters.endDate
                  ).toLocaleDateString()}). Try different dates or locations.`
                : searchTerm
                ? `No cars match your search "${searchTerm}". Try different keywords or clear the search.`
                : selectedCity
                ? `No cars are currently available in ${selectedCity}. Try selecting a different city.`
                : "No approved cars are currently available. New cars are being added regularly."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {dateFilters.isDateFilterActive && (
                <button
                  onClick={onClearDateFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Date Filters
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={() => onSearchChange("")}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
              {selectedCity && (
                <button
                  onClick={() => onCityChange("")}
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
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>
        </div>
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
