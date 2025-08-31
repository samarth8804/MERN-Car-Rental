import React, { useState, useCallback } from "react";
import { FaMapMarkerAlt, FaSnowflake, FaCar, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import DateFilterSection from "../Dashboard/DateFilterSection";
import LocationSelector from "./LocationSelector";
import BookingTypeSelector from "./BookingTypeSelector";
import LocationMap from "./LocationMap";
import { checkCarAvailability } from "../../utils/dashboard/customerDashboardUtils";

const BookingForm = ({
  car,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  pricingDetails,
}) => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [availabilityState, setAvailabilityState] = useState({
    checking: false,
    isAvailable: null,
    error: null,
  });

  const checkAvailability = useCallback(
    async (startDate, endDate) => {
      console.log("checkAvailability called with:", {
        startDate,
        endDate,
        carId: car?._id,
      });

      if (!startDate || !endDate || !car?._id) {
        console.log("Missing required data:", {
          startDate,
          endDate,
          carId: car?._id,
        });
        return;
      }

      setAvailabilityState((prev) => ({ ...prev, checking: true }));

      try {
        console.log("About to call checkCarAvailability API...");
        const result = await checkCarAvailability(car._id, startDate, endDate);
        console.log("API result:", result);

        setAvailabilityState({
          checking: false,
          isAvailable: result.isAvailable,
          error: result.success ? null : result.error,
        });

        if (!result.isAvailable && result.success) {
          toast.error(
            "Car is not available for selected dates. Please choose different dates."
          );
        }
      } catch (error) {
        console.error("Error in checkAvailability:", error);
        setAvailabilityState({
          checking: false,
          isAvailable: false,
          error: "Failed to check availability",
        });
      }
    },
    [car?._id]
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (type, locationData) => {
    setFormData((prev) => ({
      ...prev,
      [type]: locationData,
    }));
  };

  const handleMapLocationClick = (locationData) => {
    setClickedLocation(locationData);
    toast.success(
      <div>
        <p className="font-medium">Location pinned!</p>
        <p className="text-sm">
          Use buttons below to set as pickup or drop location
        </p>
      </div>,
      { duration: 4000 }
    );
  };

  const useClickedForPickup = () => {
    if (clickedLocation) {
      handleLocationChange("pickupLocation", clickedLocation);
      setClickedLocation(null);
      toast.success("Set as pickup location!");
    }
  };

  const useClickedForDrop = () => {
    if (clickedLocation) {
      handleLocationChange("dropLocation", clickedLocation);
      setClickedLocation(null);
      toast.success("Set as drop location!");
    }
  };

  const useSameLocation = () => {
    if (formData.pickupLocation?.coordinates?.latitude) {
      handleLocationChange("dropLocation", {
        ...formData.pickupLocation,
        source: "same_as_pickup",
      });
      toast.success("Drop location set same as pickup!");
    } else if (formData.dropLocation?.coordinates?.latitude) {
      handleLocationChange("pickupLocation", {
        ...formData.dropLocation,
        source: "same_as_drop",
      });
      toast.success("Pickup location set same as drop!");
    } else {
      toast.error("Please select a location first");
    }
  };

  const dateFilters = {
    startDate: formData.startDate,
    endDate: formData.endDate,
    isDateFilterActive: !!(formData.startDate && formData.endDate),
  };

  const handleDateFilterChange = (field, value) => {
    handleInputChange(field, value);

    const newStartDate = field === "startDate" ? value : formData.startDate;
    const newEndDate = field === "endDate" ? value : formData.endDate;

    if (newStartDate && newEndDate) {
      setTimeout(() => checkAvailability(newStartDate, newEndDate), 500);
    }
  };

  const handleClearDates = () => {
    setFormData((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
    }));
  };

  const isFormValid = () => {
    const datesValid =
      formData.startDate &&
      formData.endDate &&
      formData.startDate.trim() !== "" &&
      formData.endDate.trim() !== "";

    const pickupValid =
      formData.pickupLocation?.address &&
      formData.pickupLocation.address.trim() !== "";

    const dropValid =
      formData.dropLocation?.address &&
      formData.dropLocation.address.trim() !== "";

    const pickupHasCoords =
      formData.pickupLocation?.coordinates?.latitude != null &&
      formData.pickupLocation?.coordinates?.longitude != null;

    const dropHasCoords =
      formData.dropLocation?.coordinates?.latitude != null &&
      formData.dropLocation?.coordinates?.longitude != null;

    // ✅ Fix: Better availability validation logic
    const availabilityValid =
      !datesValid || // If dates not selected, skip availability check
      (!availabilityState.checking && // Not currently checking AND
        (availabilityState.isAvailable === true || // Either available is true
          availabilityState.isAvailable === null)); // Or we haven't checked yet (null)

    const overallValid =
      datesValid &&
      pickupValid &&
      dropValid &&
      pickupHasCoords &&
      dropHasCoords &&
      availabilityValid;

    console.log("Form validation:", {
      datesValid,
      pickupValid,
      dropValid,
      pickupHasCoords,
      dropHasCoords,
      availabilityValid,
      availabilityState,
      overallValid,
    });

    return overallValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const pickupHasCoords =
      formData.pickupLocation?.coordinates?.latitude != null;
    const dropHasCoords = formData.dropLocation?.coordinates?.latitude != null;

    if (!pickupHasCoords || !dropHasCoords) {
      toast.success(
        "Booking with manual addresses - driver will contact you for exact location"
      );
    }

    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <DateFilterSection
          dateFilters={dateFilters}
          onDateFilterChange={handleDateFilterChange}
          onClearDateFilters={handleClearDates}
          variant="booking"
          showClearButton={false}
          required={true}
        />

        {/* Availability Status - NEW SECTION */}
        {formData.startDate && formData.endDate && (
          <div className="mt-4">
            {availabilityState.checking && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaSpinner className="animate-spin text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Checking car availability...
                  </span>
                </div>
              </div>
            )}

            {!availabilityState.checking &&
              availabilityState.isAvailable === true && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">
                      ✅ Car is available for selected dates
                    </span>
                  </div>
                </div>
              )}

            {!availabilityState.checking &&
              availabilityState.isAvailable === false && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-800">
                      ❌ Car is not available for selected dates
                    </span>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Booking Type Selection */}
        <BookingTypeSelector
          selectedType={formData.bookingType}
          onTypeChange={(type) => handleInputChange("bookingType", type)}
          car={car}
        />

        {/* AC Option */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            <FaSnowflake className="inline mr-2 text-blue-500" />
            Air Conditioning
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="isAC"
                value="false"
                checked={!formData.isAC}
                onChange={() => handleInputChange("isAC", false)}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">Without AC</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isAC"
                value="true"
                checked={formData.isAC}
                onChange={() => handleInputChange("isAC", true)}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">With AC (+10% charges)</span>
            </label>
          </div>
        </div>

        {/* Location Selection */}
        <div className="space-y-6">
          <LocationSelector
            label="Pickup Location"
            icon={FaMapMarkerAlt}
            iconColor="text-green-500"
            placeholder="Enter pickup address or use current location..."
            value={formData.pickupLocation}
            onChange={(location) =>
              handleLocationChange("pickupLocation", location)
            }
          />

          <LocationSelector
            label="Drop Location"
            icon={FaMapMarkerAlt}
            iconColor="text-red-500"
            placeholder="Enter drop address or search nearby..."
            value={formData.dropLocation}
            onChange={(location) =>
              handleLocationChange("dropLocation", location)
            }
          />

          {/* Same Location Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={useSameLocation}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center space-x-2"
            >
              <FaMapMarkerAlt />
              <span>Use same location for pickup & drop</span>
            </button>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="bg-gray-50 rounded-lg p-4">
          <LocationMap
            pickupLocation={formData.pickupLocation}
            dropLocation={formData.dropLocation}
            height="300px"
            onLocationClick={handleMapLocationClick}
          />

          {/* Clicked Location Actions */}
          {clickedLocation && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">
                📍 Pinned: {clickedLocation.address}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={useClickedForPickup}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Use for Pickup
                </button>
                <button
                  type="button"
                  onClick={useClickedForDrop}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Use for Drop
                </button>
                <button
                  type="button"
                  onClick={() => setClickedLocation(null)}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Booking in Progress...</span>
              </>
            ) : (
              <>
                <FaCar />
                <span>
                  {isFormValid()
                    ? "Confirm Booking"
                    : "Complete Required Fields"}
                </span>
              </>
            )}
          </button>

          {!isFormValid() && (
            <p className="text-sm text-red-500 mt-2 text-center">
              Please complete all required fields above
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
