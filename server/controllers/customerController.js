const Cars = require("../models/Cars");
const Bookings = require("../models/Bookings");
const Customer = require("../models/Customer");
const Driver = require("../models/Driver");
const { nanoid } = require("nanoid");

// Fixed function to handle same-day bookings
exports.getAvailableCars = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Get all approved cars
    const allCars = await Cars.find({ status: "approved" })
      .select(
        "brand model year licensePlate pricePerKm pricePerDay imageUrl city ownerId"
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
      today.setHours(0, 0, 0, 0); // Reset to start of day

      const startDateOnly = new Date(requestedStartDate);
      startDateOnly.setHours(0, 0, 0, 0); // Reset to start of day

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
                // Fixed: Check for overlapping bookings including same-day bookings
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

      // Calculate duration for response message
      const daysDifference = Math.ceil(
        (requestedEndDate - requestedStartDate) / (1000 * 60 * 60 * 24)
      );
      const isSameDay = daysDifference === 0;
      const duration = isSameDay ? 1 : daysDifference;

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

// Enhanced booking function with same-day booking support
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
      !pickupLocation?.coordinates?.latitude ||
      !pickupLocation?.coordinates?.longitude ||
      !dropLocation?.address ||
      !dropLocation?.coordinates?.latitude ||
      !dropLocation?.coordinates?.longitude
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
    today.setHours(0, 0, 0, 0); // Reset to start of day

    const startDateOnly = new Date(requestedStartDate);
    startDateOnly.setHours(0, 0, 0, 0); // Reset to start of day

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
      uniqueCode: nanoid(10),
    });

    await newBooking.save();

    // Calculate duration for response
    const daysDifference = Math.ceil(
      (requestedEndDate - requestedStartDate) / (1000 * 60 * 60 * 24)
    );
    const isSameDay = daysDifference === 0;

    return res.status(201).json({
      success: true,
      message: isSameDay
        ? "Car booked successfully for same-day rental!"
        : `Car booked successfully for ${
            daysDifference === 0 ? 1 : daysDifference
          } days!`,
      booking: newBooking,
      bookingDetails: {
        duration: isSameDay ? 1 : daysDifference,
        isSameDay,
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

exports.getCustomerProfile = async (req, res) => {
  try {
    const customerId = req.user._id;

    const customer = await Customer.findById(customerId).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer profile fetched successfully",
      customer,
    });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.rateDriver = async (req, res) => {
  try {
    const { bookingId, rating } = req.body;
    const customerId = req.user._id;

    if (!bookingId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and valid rating (1-5) are required",
      });
    }

    // Find the booking
    const booking = await Bookings.findById(bookingId);

    // Check if booking exists
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
        message: "You are not authorized to rate for this ride",
      });
    }

    // Check if the booking is completed or cancelled
    if (!booking.isCompleted || booking.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Ride must be completed to rate the driver",
      });
    }

    // Check if the driver has already been rated
    if (booking.isRated) {
      return res.status(400).json({
        success: false,
        message: "Driver has already been rated for this ride",
      });
    }

    // Find the driver and update their rating
    const driver = await Driver.findById(booking.driver);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }
    // Calculate new average rating
    const existingRatings = driver.ratingCount || 0;
    const currentTotalRating = driver.rating * driver.ratingCount;
    const newAverageRating = Math.floor(
      Math.abs((currentTotalRating + rating) / (existingRatings + 1))
    );

    driver.rating = newAverageRating;
    driver.ratingCount = existingRatings + 1; // Increment rating count
    booking.isRated = true; // Mark the booking as rated
    await driver.save();
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Driver rated successfully",
    });
  } catch (error) {
    console.error("Error rating driver:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
