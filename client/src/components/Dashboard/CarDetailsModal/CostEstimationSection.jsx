import { FaRupeeSign } from "react-icons/fa";

const CostEstimationSection = ({ estimatedCost }) => {
  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
        <FaRupeeSign className="mr-3 text-purple-500" />
        Cost Estimation
      </h3>
      <div className="bg-gradient-to-r from-purple-50/80 via-pink-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-200/30">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-white/50">
            <span className="text-gray-600 font-semibold">Duration:</span>
            <span className="font-bold text-gray-900">
              {estimatedCost.isSameDay ? "1 day" : `${estimatedCost.days} days`}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-white/50">
            <span className="text-gray-600 font-semibold">Daily Rate:</span>
            <span className="font-bold text-gray-900">
              ₹{estimatedCost.dailyRate}
            </span>
          </div>
          {estimatedCost.days > 1 && (
            <div className="flex justify-between items-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm border border-white/40">
              <span className="text-gray-600 font-semibold text-sm">
                Calculation:
              </span>
              <span className="font-medium text-gray-800 text-sm">
                ₹{estimatedCost.dailyRate} × {estimatedCost.days} days
              </span>
            </div>
          )}
          <div className="border-t border-purple-200/50 pt-3">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-lg border border-purple-300/30">
              <span className="font-bold text-purple-900 text-lg">
                Estimated Total:
              </span>
              <span className="text-2xl font-bold text-purple-600">
                ₹{estimatedCost.totalCost}
              </span>
            </div>
            <p className="text-xs text-purple-600 mt-3 text-center font-medium">
              *Final cost: Daily Rate OR (Per KM × Distance) - whichever is more
              economical for you
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimationSection;
