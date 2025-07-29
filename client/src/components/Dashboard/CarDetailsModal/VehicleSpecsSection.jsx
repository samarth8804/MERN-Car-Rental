import { FaStar, FaCheckCircle, FaCog } from "react-icons/fa";
import { vehicleSpecsConfig } from "../../../utils/data";

const VehicleSpecsSection = ({ car }) => {
  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
        <FaCog className="mr-3 text-blue-500" />
        Vehicle Specifications
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {vehicleSpecsConfig.map((spec, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${spec.bgColor} backdrop-blur-sm rounded-xl p-4 shadow-md border ${spec.borderColor}`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <spec.icon className={`${spec.iconColor} text-xl`} />
              <span className={`text-sm font-semibold ${spec.textColor}`}>
                {spec.label}
              </span>
            </div>
            <p className={`${spec.valueColor} font-bold text-lg`}>
              {spec.getValue(car)}
            </p>
          </div>
        ))}

        {/* Customer Rating Box */}
        <div className="bg-gradient-to-br from-yellow-50/80 to-yellow-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-yellow-200/30">
          <div className="flex items-center space-x-2 mb-2">
            <FaStar className="text-yellow-600 text-xl" />
            <span className="text-sm font-semibold text-yellow-900">
              Customer Rating
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-yellow-800 font-bold text-lg">
              {car.rating && car.rating > 0 ? car.rating.toFixed(1) : "New"}
            </p>
            {car.ratingCount > 0 && (
              <span className="text-xs text-yellow-700 bg-yellow-200/50 px-2 py-1 rounded-full">
                {car.ratingCount} reviews
              </span>
            )}
          </div>
        </div>

        {/* Total Trips Box */}
        <div className="bg-gradient-to-br from-indigo-50/80 to-indigo-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-indigo-200/30">
          <div className="flex items-center space-x-2 mb-2">
            <FaCheckCircle className="text-indigo-600 text-xl" />
            <span className="text-sm font-semibold text-indigo-900">
              Total Trips
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-indigo-800 font-bold text-lg">
              {car.totalRides || 0}
            </p>
            <span className="text-xs text-indigo-700 bg-indigo-200/50 px-2 py-1 rounded-full">
              {car.totalRides > 0 ? "Experienced" : "New Car"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSpecsSection;
