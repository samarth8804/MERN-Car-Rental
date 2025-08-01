import React, { useState, memo } from "react";
import { MdDirectionsCar } from "react-icons/md";
import { vehicleSpecsConfig } from "../../utils/data";

const CarInfoCard = memo(({ booking }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // ✅ Add safety checks
  if (!booking || !booking.car) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-500">Loading car information...</p>
      </div>
    );
  }

  // ✅ Filter specs to show only Brand, Model, and License Plate
  const displaySpecs = vehicleSpecsConfig.filter(
    (spec) =>
      spec.label === "Brand" ||
      spec.label === "Model" ||
      spec.label === "License Plate"
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        {booking.car?.imageUrl ? (
          <>
            <img
              src={booking.car.imageUrl}
              alt={`${booking.car.brand} ${booking.car.model}`}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="text-center animate-pulse">
                  <MdDirectionsCar className="w-20 h-20 text-blue-400 mx-auto mb-3" />
                  <p className="text-blue-600 font-semibold text-lg">
                    Loading image...
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MdDirectionsCar className="w-24 h-24 text-blue-400 mx-auto mb-4" />
              <p className="text-blue-500 text-sm mt-1">No image available</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Vehicle Information
        </h2>

        {/* ✅ UPDATED: Using vehicleSpecsConfig from data.js */}
        <div className="grid grid-cols-3 gap-4">
          {displaySpecs.map((spec, index) => {
            const IconComponent = spec.icon;
            const value = spec.getValue(booking.car);

            return (
              <div
                key={index}
                className={`text-center p-3 bg-gradient-to-br ${spec.bgColor} border ${spec.borderColor} rounded-lg`}
              >
                <IconComponent
                  className={`${spec.iconColor} text-xl mx-auto mb-2`}
                />
                <p className={`text-xs ${spec.textColor} mb-1 font-medium`}>
                  {spec.label}
                </p>
                <p className={`font-semibold ${spec.valueColor} text-sm`}>
                  {value || "N/A"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default CarInfoCard;
