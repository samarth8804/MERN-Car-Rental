import React from "react";
import { FaRupeeSign, FaRoute, FaClock } from "react-icons/fa";

const BookingTypeSelector = ({ selectedType, onTypeChange, car }) => {
  const bookingTypes = [
    {
      id: "perDay",
      title: "Per Day Rental",
      description: "Fixed daily rate - Best for longer trips",
      icon: FaClock,
      price: car.pricePerDay,
      benefits: [
        "Unlimited KMs per day",
        "Best value for long trips",
        "No distance restrictions",
      ],
    },
    {
      id: "perKm",
      title: "Per KM Rental",
      description: "Pay based on distance - Best for short trips",
      icon: FaRoute,
      price: car.pricePerKm,
      benefits: [
        "Pay only for distance traveled",
        "Cost-effective for short trips",
        "Flexible pricing",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="flex items-center text-lg font-semibold text-gray-900">
        <FaRupeeSign className="mr-2 text-green-500" />
        Choose Pricing Model
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookingTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <div
              key={type.id}
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onTypeChange(type.id)}
            >
              {/* Selection indicator */}
              <div className="absolute top-4 right-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="pr-8">
                <div className="flex items-center space-x-3 mb-2">
                  <Icon
                    className={`text-xl ${
                      isSelected ? "text-blue-600" : "text-gray-600"
                    }`}
                  />
                  <h4
                    className={`font-semibold ${
                      isSelected ? "text-blue-900" : "text-gray-900"
                    }`}
                  >
                    {type.title}
                  </h4>
                </div>

                <p className="text-sm text-gray-600 mb-3">{type.description}</p>

                <div className="flex items-center space-x-1 mb-3">
                  <FaRupeeSign className="text-green-600 text-lg" />
                  <span className="text-2xl font-bold text-green-600">
                    {type.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {type.id === "perDay" ? "/day" : "/km"}
                  </span>
                </div>

                <ul className="space-y-1">
                  {type.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="text-xs text-gray-600 flex items-center space-x-1"
                    >
                      <span className="text-green-500">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong>{" "}
          {selectedType === "perDay"
            ? "Daily rate applies for the entire rental period regardless of distance traveled."
            : "Final amount will be calculated based on actual distance traveled after trip completion."}
        </p>
      </div>
    </div>
  );
};

export default BookingTypeSelector;
