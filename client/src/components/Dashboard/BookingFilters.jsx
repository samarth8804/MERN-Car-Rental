import { customerBookingFilters } from "../../utils/dashboard/customerDashboardUtils";

const BookingFilters = ({ bookingFilter, onFilterChange, bookingCounts }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {customerBookingFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
              bookingFilter === filter.key
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{filter.label}</span>
            <span className="bg-white px-2 py-1 rounded-full text-xs">
              {bookingCounts[filter.key]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingFilters;
