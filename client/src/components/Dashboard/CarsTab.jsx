import { FaSearch } from "react-icons/fa";
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
