import React, { useState } from "react";
import { FaMapMarkerAlt, FaSnowflake, FaCar, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import DateFilterSection from "../Dashboard/DateFilterSection";
import LocationSelector from "./LocationSelector";
import BookingTypeSelector from "./BookingTypeSelector";
import LocationMap from "./LocationMap";

const BookingForm = ({
  car,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  pricingDetails,
}) => {
  const [clickedLocation, setClickedLocation] = useState(null);

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
  };

  const handleClearDates = () => {
    setFormData((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
    }));
  };

  // ✅ IMPROVED: More flexible form validation
  const isFormValid = () => {
    

    // Check dates
    const datesValid =
      formData.startDate &&
      formData.endDate &&
      formData.startDate.trim() !== "" &&
      formData.endDate.trim() !== "";

    // ✅ FLEXIBLE: Check if pickup location has address (coordinates optional for manual entry)
    const pickupValid =
      formData.pickupLocation?.address &&
      formData.pickupLocation.address.trim() !== "";

    // ✅ FLEXIBLE: Check if drop location has address (coordinates optional for manual entry)
    const dropValid =
      formData.dropLocation?.address &&
      formData.dropLocation.address.trim() !== "";

    const pickupHasCoords =
      formData.pickupLocation?.coordinates?.latitude != null &&
      formData.pickupLocation?.coordinates?.longitude != null;

    const dropHasCoords =
      formData.dropLocation?.coordinates?.latitude != null &&
      formData.dropLocation?.coordinates?.longitude != null;


    const overallValid =
      datesValid &&
      pickupValid &&
      dropValid &&
      pickupHasCoords &&
      dropHasCoords;
    console.log("Overall valid:", overallValid);

    return overallValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // ✅ WARNING: Warn user about manual addresses without coordinates
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

      {/* ✅ UPDATED DEBUG PANEL */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-yellow-700">Form Status:</p>
            <p className={isFormValid() ? "text-green-600" : "text-red-600"}>
              {isFormValid() ? "✅ READY TO BOOK" : "❌ INCOMPLETE"}
            </p>
          </div>

          <div>
            <p className="font-medium text-yellow-700">Dates:</p>
            <p>
              {formData.startDate && formData.endDate ? "✅ Set" : "❌ Missing"}
            </p>
          </div>

          <div>
            <p className="font-medium text-yellow-700">Pickup:</p>
            <p>{formData.pickupLocation?.address ? "✅ Set" : "❌ Missing"}</p>
            <p className="text-xs">
              Coords:{" "}
              {formData.pickupLocation?.coordinates?.latitude != null
                ? "✅"
                : "📍 Pin on map"}
            </p>
          </div>

          <div>
            <p className="font-medium text-yellow-700">Drop:</p>
            <p>{formData.dropLocation?.address ? "✅ Set" : "❌ Missing"}</p>
            <p className="text-xs">
              Coords:{" "}
              {formData.dropLocation?.coordinates?.latitude != null
                ? "✅"
                : "📍 Pin on map"}
            </p>
          </div>
        </div>
      </div>

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
