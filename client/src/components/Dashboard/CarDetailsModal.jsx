import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";
import CarImageSection from "./CarDetailsModal/CarImageSection";
import DateRangeSection from "./CarDetailsModal/DateRangeSection";
import CostEstimationSection from "./CarDetailsModal/CostEstimationSection";
import VehicleSpecsSection from "./CarDetailsModal/VehicleSpecsSection";
import PricingOptionsSection from "./CarDetailsModal/PricingOptionsSection";
import BookingButton from "./CarDetailsModal/BookingButton";

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
        {/* Backdrop */}
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

        {/* Modal Content */}
        <div className="relative inline-block w-full max-w-5xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20">
          {/* Header */}
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
              {/* Left Column */}
              <div className="space-y-6">
                <CarImageSection
                  car={car}
                  imageLoaded={imageLoaded}
                  setImageLoaded={setImageLoaded}
                />

                {hasSelectedDates && (
                  <DateRangeSection
                    dateFilters={dateFilters}
                    isSameDay={isSameDay}
                  />
                )}

                {estimatedCost && (
                  <CostEstimationSection estimatedCost={estimatedCost} />
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <VehicleSpecsSection car={car} />
                <PricingOptionsSection car={car} />
              </div>
            </div>

            {/* Book Button */}
            <BookingButton
              onBookCar={onBookCar}
              car={car}
              hasSelectedDates={hasSelectedDates}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;
