import { useState } from "react";
import {
  FaTimes,
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaGasPump,
  FaUsers,
  FaCog,
  FaPhone,
  FaUser,
  FaSnowflake,
  FaIdCard,
  FaCheckCircle,
  FaClock,
  FaStar,
} from "react-icons/fa";
import { MdDirectionsCar, MdLocalGasStation } from "react-icons/md";

const CarDetailsModal = ({ isOpen, car, dateFilters, onClose, onBookCar }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!isOpen || !car) return null;

  const hasSelectedDates = dateFilters.startDate && dateFilters.endDate;
  const isSameDay =
    dateFilters.startDate === dateFilters.endDate && hasSelectedDates;

  // Calculate estimated cost if dates are selected
  const calculateEstimatedCost = () => {
    if (!hasSelectedDates) return null;

    const startDate = new Date(dateFilters.startDate);
    const endDate = new Date(dateFilters.endDate);
    const daysDifference = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    );
    const days = daysDifference === 0 ? 1 : daysDifference;

    const dailyRate = car.pricePerDay;
    const totalCost = dailyRate * days;

    return {
      days,
      dailyRate,
      totalCost,
      isSameDay: daysDifference === 0,
    };
  };

  const estimatedCost = calculateEstimatedCost();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-lg transition-all duration-300"
          onClick={onClose}
          style={{
            backdropFilter: "blur(12px) saturate(180%)",
            WebkitBackdropFilter: "blur(12px) saturate(180%)",
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          }}
        />

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="relative inline-block w-full max-w-5xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20">
          {/* ✅ CLEANED Header - Only Icon + Car Name */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                  <MdDirectionsCar className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white">
                    {car.brand} {car.model}
                  </h2>
                  {/* ✅ REMOVED RATING AND TOTAL RIDES FROM HEADER */}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-200 border border-transparent hover:border-white/30"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              {/* Left Column: Car Image + Selected Date Range + Cost Estimation */}
              <div className="space-y-6">
                {/* Car Image */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-lg border border-white/50">
                  {car.imageUrl ? (
                    <>
                      <img
                        src={car.imageUrl}
                        alt={`${car.brand} ${car.model}`}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          imageLoaded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-110"
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
                        <p className="text-blue-600 font-bold text-xl">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-blue-500 text-sm mt-1">
                          No image available
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Car Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 border border-green-400/50">
                      <FaCheckCircle className="w-4 h-4" />
                      <span>Available</span>
                    </div>
                  </div>

                  {/* Rating Badge on Image */}
                  {car.rating > 0 && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                        <div className="flex items-center space-x-1">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className="font-bold text-gray-900 text-sm">
                            {car.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Date Range */}
                {hasSelectedDates && (
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
                            {new Date(dateFilters.startDate).toLocaleDateString(
                              "en-IN",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-white/50">
                          <span className="text-sm font-semibold text-indigo-900 block mb-1">
                            End Date:
                          </span>
                          <p className="text-indigo-800 font-bold text-lg">
                            {new Date(dateFilters.endDate).toLocaleDateString(
                              "en-IN",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
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
                )}

                {/* ✅ MOVED Cost Estimation - Under Dates Section */}
                {estimatedCost && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                      <FaRupeeSign className="mr-3 text-purple-500" />
                      Cost Estimation
                    </h3>
                    <div className="bg-gradient-to-r from-purple-50/80 via-pink-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-200/30">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-white/50">
                          <span className="text-gray-600 font-semibold">
                            Duration:
                          </span>
                          <span className="font-bold text-gray-900">
                            {estimatedCost.isSameDay
                              ? "1 day"
                              : `${estimatedCost.days} days`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-white/50">
                          <span className="text-gray-600 font-semibold">
                            Daily Rate:
                          </span>
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
                              ₹{estimatedCost.dailyRate} × {estimatedCost.days}{" "}
                              days
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
                            *Final cost: Daily Rate OR (Per KM × Distance) -
                            whichever is more economical for you
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Vehicle Specifications + Pricing */}
              <div className="space-y-6">
                {/* Vehicle Specifications */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <FaCog className="mr-3 text-blue-500" />
                    Vehicle Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-blue-200/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <MdDirectionsCar className="text-blue-600 text-xl" />
                        <span className="text-sm font-semibold text-blue-900">
                          Brand
                        </span>
                      </div>
                      <p className="text-blue-800 font-bold text-lg">
                        {car.brand}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50/80 to-purple-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-purple-200/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaCar className="text-purple-600 text-xl" />
                        <span className="text-sm font-semibold text-purple-900">
                          Model
                        </span>
                      </div>
                      <p className="text-purple-800 font-bold text-lg">
                        {car.model}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-green-200/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaCalendarAlt className="text-green-600 text-xl" />
                        <span className="text-sm font-semibold text-green-900">
                          Year
                        </span>
                      </div>
                      <p className="text-green-800 font-bold text-lg">
                        {car.year}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-orange-200/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaMapMarkerAlt className="text-orange-600 text-xl" />
                        <span className="text-sm font-semibold text-orange-900">
                          Location
                        </span>
                      </div>
                      <p className="text-orange-800 font-bold text-lg">
                        {car.city}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-red-50/80 to-red-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-red-200/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaIdCard className="text-red-600 text-xl" />
                        <span className="text-sm font-semibold text-red-900">
                          License Plate
                        </span>
                      </div>
                      <p className="text-red-800 font-bold text-lg">
                        {car.licensePlate}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50/80 to-teal-100/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-teal-200/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaClock className="text-teal-600 text-xl" />
                        <span className="text-sm font-semibold text-teal-900">
                          Minimum Rental
                        </span>
                      </div>
                      <p className="text-teal-800 font-bold text-lg">
                        1 Full Day
                      </p>
                    </div>

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
                          {car.rating && car.rating > 0
                            ? car.rating.toFixed(1)
                            : "New"}
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

                {/* Flexible Pricing Options */}
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
                        <div className="text-sm text-gray-600 font-semibold">
                          Per Day
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Best for longer trips
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-white/50">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          ₹{car.pricePerKm}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">
                          Per KM
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Best for short distances
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-100/80 to-green-100/80 backdrop-blur-sm rounded-xl border border-blue-200/30">
                      <p className="text-xs text-blue-700 font-semibold text-center">
                        ✨ Enjoy full-day benefits with our minimum 1-day rental
                        - Great value for any trip duration!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Button - At Bottom */}
            <div className="pt-6 border-t border-gray-200/50">
              <button
                onClick={() => onBookCar(car)}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-5 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center space-x-3 border border-white/20"
              >
                <FaCar className="w-6 h-6" />
                <span>
                  {hasSelectedDates
                    ? "Proceed to Book This Car"
                    : "Continue to Booking"}
                </span>
              </button>
              <p className="text-center text-sm text-gray-500 mt-3 font-medium">
                {hasSelectedDates
                  ? "Complete your booking with the selected dates"
                  : "Choose your rental dates on the next step"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;
