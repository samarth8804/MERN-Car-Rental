import { FaCalendarAlt } from "react-icons/fa";

const DateRangeSection = ({ dateFilters, isSameDay }) => {
  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
        <FaCalendarAlt className="mr-3 text-indigo-500" />
        Selected Rental Period
      </h3>
      <div className="bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-indigo-200/30">
        <div className="space-y-4">
          <div className="p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-white/50">
            <span className="text-sm font-semibold text-indigo-900 block mb-1">
              Start Date:
            </span>
            <p className="text-indigo-800 font-bold text-lg">
              {new Date(dateFilters.startDate).toLocaleDateString("en-IN", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-white/50">
            <span className="text-sm font-semibold text-indigo-900 block mb-1">
              End Date:
            </span>
            <p className="text-indigo-800 font-bold text-lg">
              {new Date(dateFilters.endDate).toLocaleDateString("en-IN", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          {isSameDay && (
            <div className="p-3 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 backdrop-blur-sm rounded-lg border border-indigo-300/30">
              <p className="text-sm text-indigo-700 font-bold text-center">
                ✨ Same-day rental - Full day benefits included!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateRangeSection;
