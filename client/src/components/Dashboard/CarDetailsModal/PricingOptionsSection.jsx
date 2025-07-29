import { FaRupeeSign } from "react-icons/fa";

const PricingOptionsSection = ({ car }) => {
  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
        <FaRupeeSign className="mr-3 text-green-500" />
        Flexible Pricing Options
      </h3>
      <div className="bg-gradient-to-r from-green-50/80 via-emerald-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200/30">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-white/50">
            <div className="text-3xl font-bold text-green-600 mb-1">
              ₹{car.pricePerDay}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Per Day</div>
            <div className="text-xs text-gray-500 mt-1">
              Best for longer trips
            </div>
          </div>
          <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-white/50">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              ₹{car.pricePerKm}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Per KM</div>
            <div className="text-xs text-gray-500 mt-1">
              Best for short distances
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-100/80 to-green-100/80 backdrop-blur-sm rounded-xl border border-blue-200/30">
          <p className="text-xs text-blue-700 font-semibold text-center">
            ✨ Enjoy full-day benefits with our minimum 1-day rental - Great
            value for any trip duration!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingOptionsSection;
