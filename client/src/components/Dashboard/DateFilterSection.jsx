import {
  FaCalendarAlt,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import {
  validateDateRange,
  calculateRentalDays,
} from "../../utils/dashboard/dateUtils";

const DateFilterSection = ({
  dateFilters,
  onDateFilterChange,
  onClearDateFilters,
  // ✅ NEW: Props for different use cases
  variant = "filter", // "filter" | "booking"
  title,
  showClearButton = true,
  showDuration = true,
  containerClassName = "",
  required = false,
}) => {
  // ✅ FIXED: Calculate duration with inclusive method
  const calculateDuration = () => {
    if (!dateFilters.startDate || !dateFilters.endDate) return 0;
    return calculateRentalDays(dateFilters.startDate, dateFilters.endDate);
  };

  const duration = calculateDuration();
  const isSameDay =
    dateFilters.startDate === dateFilters.endDate && dateFilters.startDate;

  // Check if current date range is valid
  const validation =
    dateFilters.startDate && dateFilters.endDate
      ? validateDateRange(dateFilters.startDate, dateFilters.endDate)
      : { isValid: true };

  // ✅ Dynamic styling based on variant
  const getContainerClasses = () => {
    const baseClasses = "rounded-lg p-4";

    if (variant === "booking") {
      return `${baseClasses} bg-white border border-gray-200 ${containerClassName}`;
    }

    // Default filter variant
    return `${baseClasses} bg-blue-50 border border-blue-200 ${containerClassName}`;
  };

  const getHeaderTextColor = () => {
    return variant === "booking" ? "text-gray-900" : "text-blue-900";
  };

  const getDefaultTitle = () => {
    return variant === "booking"
      ? "Select Rental Period"
      : "Filter by Rental Dates";
  };

  return (
    <div className={getContainerClasses()}>
      <div className="flex items-center justify-between mb-3">
        <h3
          className={`text-sm font-medium ${getHeaderTextColor()} flex items-center`}
        >
          <FaCalendarAlt className="mr-2" />
          {title || getDefaultTitle()}
        </h3>
        {showClearButton && dateFilters.isDateFilterActive && (
          <button
            onClick={onClearDateFilters}
            className={`text-sm underline font-medium ${
              variant === "booking"
                ? "text-gray-600 hover:text-gray-800"
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            Clear Dates
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date {required && "*"}
          </label>
          <input
            type="date"
            value={dateFilters.startDate}
            onChange={(e) => onDateFilterChange("startDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors duration-200 ${
              variant === "booking"
                ? "py-3 focus:ring-blue-500 focus:border-blue-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            required={required}
          />
          <p className="text-xs text-gray-500 mt-1">
            {variant === "booking"
              ? "Select your rental start date"
              : "You can select from today onwards"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date {required && "*"}
          </label>
          <input
            type="date"
            value={dateFilters.endDate}
            onChange={(e) => onDateFilterChange("endDate", e.target.value)}
            min={
              dateFilters.startDate || new Date().toISOString().split("T")[0]
            }
            disabled={!dateFilters.startDate}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              variant === "booking"
                ? "py-3 focus:ring-blue-500 focus:border-blue-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            required={required}
          />
          {!dateFilters.startDate ? (
            <p className="text-xs text-gray-500 mt-1">
              Please select a start date first
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              {variant === "booking"
                ? "Can be same as start date for same-day rental"
                : "Can be same as start date for single-day rental"}
            </p>
          )}
        </div>
      </div>

      {/* Duration Display */}
      {showDuration && dateFilters.startDate && dateFilters.endDate && (
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
            // Show normal duration display with variant-specific styling
            <div
              className={`p-2 rounded-lg ${
                variant === "booking"
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-blue-100"
              }`}
            >
              <div
                className={`flex items-start space-x-2 ${
                  variant === "booking" ? "text-blue-900" : "text-blue-700"
                }`}
              >
                {variant === "booking" && (
                  <FaInfoCircle className="text-blue-500 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {variant === "booking" ? "Rental Duration:" : "Duration:"}{" "}
                    {isSameDay ? (
                      <span className="font-semibold">
                        {variant === "booking"
                          ? "Same Day (1 Day)"
                          : "Same-day rental (1 day)"}
                      </span>
                    ) : (
                      <span>{duration} days</span>
                    )}
                  </p>
                  {variant === "booking" && (
                    <p className="text-xs text-blue-700 mt-1">
                      {isSameDay
                        ? "Perfect for day trips and city tours"
                        : `From ${new Date(
                            dateFilters.startDate
                          ).toLocaleDateString()} to ${new Date(
                            dateFilters.endDate
                          ).toLocaleDateString()}`}
                    </p>
                  )}
                  {variant === "filter" && isSameDay && (
                    <div className="text-xs text-blue-600 mt-1">
                      Perfect for short trips!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateFilterSection;
