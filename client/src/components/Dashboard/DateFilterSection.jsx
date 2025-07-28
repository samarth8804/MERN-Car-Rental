import { FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import { validateDateRange } from "../../utils/dashboard/dateUtils";

const DateFilterSection = ({
  dateFilters,
  onDateFilterChange,
  onClearDateFilters,
}) => {
  // Calculate duration with same-day handling
  const calculateDuration = () => {
    if (!dateFilters.startDate || !dateFilters.endDate) return 0;

    const startDate = new Date(dateFilters.startDate);
    const endDate = new Date(dateFilters.endDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Return at least 1 day for same-day bookings
    return diffInDays === 0 ? 1 : diffInDays;
  };

  const duration = calculateDuration();
  const isSameDay =
    dateFilters.startDate === dateFilters.endDate && dateFilters.startDate;

  // Check if current date range is valid
  const validation =
    dateFilters.startDate && dateFilters.endDate
      ? validateDateRange(dateFilters.startDate, dateFilters.endDate)
      : { isValid: true };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-blue-900 flex items-center">
          <FaCalendarAlt className="mr-2" />
          Filter by Rental Dates
        </h3>
        {dateFilters.isDateFilterActive && (
          <button
            onClick={onClearDateFilters}
            className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Clear Dates
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={dateFilters.startDate}
            onChange={(e) => onDateFilterChange("startDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">
            You can select from today onwards
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={dateFilters.endDate}
            onChange={(e) => onDateFilterChange("endDate", e.target.value)}
            min={
              dateFilters.startDate || new Date().toISOString().split("T")[0]
            }
            disabled={!dateFilters.startDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {!dateFilters.startDate ? (
            <p className="text-xs text-gray-500 mt-1">
              Please select a start date first
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Can be same as start date for single-day rental
            </p>
          )}
        </div>
      </div>

      {dateFilters.startDate && dateFilters.endDate && (
        <div className="mt-3">
          {!validation.isValid ? (
            // Show error state for invalid date ranges
            <div className="p-2 bg-red-100 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-red-700">
                <FaExclamationTriangle className="flex-shrink-0" />
                <span className="font-medium">Invalid Date Range:</span>
                <span>{validation.error}</span>
              </div>
            </div>
          ) : (
            // Show normal duration display
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="text-sm text-blue-700">
                <span className="font-medium">Duration:</span>{" "}
                {isSameDay ? (
                  <span className="font-semibold">Same-day rental (1 day)</span>
                ) : (
                  <span>{duration} days</span>
                )}
              </div>
              {isSameDay && (
                <div className="text-xs text-blue-600 mt-1">
                  Perfect for short trips!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateFilterSection;
