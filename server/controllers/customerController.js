const Cars = require("../models/Cars");
const Bookings = require("../models/Bookings");
const Customer = require("../models/Customer");
const Driver = require("../models/Driver");
const { nanoid } = require("nanoid");
const { calculateRentalDays } = require("../utils/calculateRentalDays");

// Fixed function to handle same-day bookings
exports.getAvailableCars = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Get all approved cars
    const allCars = await Cars.find({ status: "approved" })
      .select(
        "brand model year licensePlate pricePerKm pricePerDay imageUrl city ownerId rating ratingCount totalRides"
      )
      .populate("ownerId", "fullname phone")
      .sort({
        createdAt: -1,
      });

    if (allCars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No approved cars found",
      });
    }

    let availableCars = allCars;

    // If dates are provided, filter based on booking conflicts
    if (startDate && endDate) {
      const requestedStartDate = new Date(startDate);
      const requestedEndDate = new Date(endDate);

      // Fixed: Allow same-day bookings - end date can be same as start date
      if (requestedEndDate < requestedStartDate) {
        return res.status(400).json({
          success: false,
          message: "End date cannot be before start date",
        });
      }

      // Fixed: Allow today's date - only prevent actual past dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startDateOnly = new Date(requestedStartDate);
      startDateOnly.setHours(0, 0, 0, 0);

      if (startDateOnly < today) {
        return res.status(400).json({
          success: false,
          message: "Start date cannot be in the past",
        });
      }

      // Filter cars that don't have conflicting bookings
      const availableCarIds = await Promise.all(
        allCars.map(async (car) => {
          const conflictingBooking = await Bookings.findOne({
            car: car._id,
            isCancelled: false,
            isCompleted: false,
            $or: [
              {
                $and: [
                  { startDate: { $lte: requestedEndDate } },
                  { endDate: { $gte: requestedStartDate } },
                ],
              },
            ],
          });

          return conflictingBooking ? null : car._id;
        })
      );

      // Filter out cars with conflicts
      availableCars = allCars.filter((car) =>
        availableCarIds.includes(car._id)
      );

      // ✅ FIXED: Calculate duration using inclusive method
      const duration = calculateRentalDays(startDate, endDate);
      const isSameDay = startDate === endDate;

      return res.status(200).json({
        success: true,
        message: isSameDay
          ? `Cars available for same-day rental (${new Date(
              startDate
            ).toLocaleDateString()})`
          : `Cars available from ${new Date(
              startDate
            ).toLocaleDateString()} to ${new Date(
              endDate
            ).toLocaleDateString()} (${duration} days)`,
        cars: availableCars,
        totalCount: availableCars.length,
        dateRange: {
          startDate,
          endDate,
          duration,
          isSameDay,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "All approved cars fetched successfully",
      cars: availableCars,
      totalCount: availableCars.length,
      dateRange: null,
    });
  } catch (error) {
    console.error("Error fetching available cars:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ FIXED: Enhanced booking function with proper pricing and minimum charges
exports.bookCar = async (req, res) => {
  
  try {
    const {
      carId,
      startDate,
      endDate,
      bookingType,
      isAC = false,
      pickupLocation,
      dropLocation,
    } = req.body;

    const customerId = req.user._id;

    // Validate required fields
    if (
      !carId ||
      !startDate ||
      !endDate ||
      !bookingType ||
      !pickupLocation?.address ||
      pickupLocation?.coordinates?.latitude == null ||
      pickupLocation?.coordinates?.longitude == null ||
      !dropLocation?.address ||
      dropLocation?.coordinates?.latitude == null ||
      dropLocation?.coordinates?.longitude == null
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const requestedStartDate = new Date(startDate);
    const requestedEndDate = new Date(endDate);

    // Fixed: Allow same-day bookings - end date can be same as start date
    if (requestedEndDate < requestedStartDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    // Fixed: Allow today's date - only prevent actual past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDateOnly = new Date(requestedStartDate);
    startDateOnly.setHours(0, 0, 0, 0);

    if (startDateOnly < today) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past",
      });
    }

    // Check if car exists and is approved
    const car = await Cars.findOne({
      _id: carId,
      status: "approved",
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found or not approved",
      });
    }

    // Check for date conflicts with improved overlap detection
    const conflictingBooking = await Bookings.findOne({
      car: carId,
      isCancelled: false,
      isCompleted: false,
      $and: [
        { startDate: { $lte: requestedEndDate } },
        { endDate: { $gte: requestedStartDate } },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: `Car is already booked from ${conflictingBooking.startDate.toLocaleDateString()} to ${conflictingBooking.endDate.toLocaleDateString()}`,
        conflictingBooking: {
          startDate: conflictingBooking.startDate,
          endDate: conflictingBooking.endDate,
        },
      });
    }

    // Find available driver for the same dates
    const drivers = await Driver.find({
      status: "approved",
      city: car.city,
    }).sort({
      rating: -1,
    });

    if (drivers.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No drivers available in ${car.city}`,
      });
    }

    let selectedDriver = null;

    for (const driver of drivers) {
      const driverConflict = await Bookings.exists({
        driver: driver._id,
        isCancelled: false,
        isCompleted: false,
        $and: [
          { startDate: { $lte: requestedEndDate } },
          { endDate: { $gte: requestedStartDate } },
        ],
      });

      if (!driverConflict) {
        selectedDriver = driver;
        break;
      }
    }

    if (!selectedDriver) {
      return res.status(404).json({
        success: false,
        message: "No drivers available for the selected dates",
      });
    }

    // ✅ FIXED: Calculate rental days using inclusive method
    const rentalDays = calculateRentalDays(startDate, endDate);

    // ✅ FIXED: Calculate initial amount with minimum 1-day charge guarantee
    let initialAmount = 0;
    let minimumChargeApplied = false;

    if (bookingType === "perDay") {
      initialAmount = car.pricePerDay * rentalDays;
    } else if (bookingType === "perKm") {
      // ✅ CRITICAL: For per-KM bookings, guarantee minimum 1-day charge
      const minimumDayCharge = car.pricePerDay;
      // Set minimum charge as initial amount - actual KM charges will be calculated on completion
      initialAmount = minimumDayCharge;
      minimumChargeApplied = true;
    }

    // Add AC charges if selected (10% extra)
    if (isAC) {
      initialAmount += Math.round(initialAmount * 0.1);
    }

    // Create the booking
    const newBooking = new Bookings({
      customer: customerId,
      driver: selectedDriver._id,
      car: carId,
      startDate: requestedStartDate,
      endDate: requestedEndDate,
      bookingType,
      isAC,
      pickupLocation: {
        address: pickupLocation.address,
        coordinates: {
          latitude: pickupLocation.coordinates.latitude,
          longitude: pickupLocation.coordinates.longitude,
        },
      },
      dropLocation: {
        address: dropLocation.address,
        coordinates: {
          latitude: dropLocation.coordinates.latitude,
          longitude: dropLocation.coordinates.longitude,
        },
      },
      totalAmount: initialAmount, // ✅ Set initial amount with minimum guarantee
      uniqueCode: nanoid(10),
    });

    await newBooking.save();

    // ✅ FIXED: Return proper duration calculation
    const isSameDay = startDate === endDate;

    return res.status(201).json({
      success: true,
      message: isSameDay
        ? "Car booked successfully for same-day rental!"
        : `Car booked successfully for ${rentalDays} days!`,
      booking: newBooking,
      bookingDetails: {
        duration: rentalDays,
        isSameDay,
        minimumChargeApplied,
        initialAmount,
      },
    });
  } catch (error) {
    console.error("Error booking car:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// rateRide (Combined Rating)
exports.rateRide = async (req, res) => {
  try {
    const { bookingId, driverRating, carRating, comment } = req.body;
    const customerId = req.user._id;

    // Validate input
    if (!bookingId || !driverRating || !carRating) {
      return res.status(400).json({
        success: false,
        message: "Booking ID, driver rating, and car rating are required",
      });
    }

    if (
      driverRating < 1 ||
      driverRating > 5 ||
      carRating < 1 ||
      carRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Both ratings must be between 1 and 5",
      });
    }

    // Find the booking
    const booking = await Bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the customer is authorized to rate this booking
    if (booking.customer.toString() !== customerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to rate this ride",
      });
    }

    // Check if the booking is completed
    if (!booking.isCompleted || booking.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Ride must be completed to rate",
      });
    }

    // Check if already rated
    if (booking.isRated) {
      return res.status(400).json({
        success: false,
        message: "This ride has already been rated",
      });
    }

    // Find the driver and car
    const driver = await Driver.findById(booking.driver);
    const car = await Cars.findById(booking.car);

    if (!driver || !car) {
      return res.status(404).json({
        success: false,
        message: "Driver or car not found",
      });
    }

    // Update Driver Rating
    const driverExistingRatings = driver.ratingCount || 0;
    const driverCurrentTotalRating = driver.rating * driverExistingRatings;
    const driverNewAverageRating =
      (driverCurrentTotalRating + driverRating) / (driverExistingRatings + 1);

    driver.rating = Math.round(driverNewAverageRating * 10) / 10; // Round to 1 decimal
    driver.ratingCount = driverExistingRatings + 1;

    // Update Car Rating
    const carExistingRatings = car.ratingCount || 0;
    const carCurrentTotalRating = car.rating * carExistingRatings;
    const carNewAverageRating =
      (carCurrentTotalRating + carRating) / (carExistingRatings + 1);

    car.rating = Math.round(carNewAverageRating * 10) / 10; // Round to 1 decimal
    car.ratingCount = carExistingRatings + 1;

    // Update booking with ratings
    booking.isRated = true;
    booking.driverRating = driverRating;
    booking.carRating = carRating;
    booking.ratingComment = comment || "";
    booking.ratedAt = new Date();

    // Save all updates
    await Promise.all([driver.save(), car.save(), booking.save()]);

    return res.status(200).json({
      success: true,
      message: "Ride rated successfully",
      data: {
        driverRating: {
          given: driverRating,
          newAverage: driver.rating,
          totalRatings: driver.ratingCount,
        },
        carRating: {
          given: carRating,
          newAverage: car.rating,
          totalRatings: car.ratingCount,
        },
      },
    });
  } catch (error) {
    console.error("Error rating ride:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
