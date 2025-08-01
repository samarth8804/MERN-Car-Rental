export const BASE_URL = "http://localhost:3000";

export const API_PATHS = {
  // Auth :
  AUTH: {
    LOGIN_ADMIN: "api/v1/auth/login/admin",
    LOGIN_CUSTOMER: "api/v1/auth/login/customer",
    LOGIN_CAR_OWNER: "api/v1/auth/login/car-owner",
    LOGIN_DRIVER: "api/v1/auth/login/driver",
    REGISTER_CUSTOMER: "api/v1/auth/register/customer",
    REGISTER_CAR_OWNER: "api/v1/auth/register/car-owner",
    REGISTER_DRIVER: "api/v1/auth/register/driver",
    CREATE_CUSTOMER: "api/v1/auth/create/customer",
    CREATE_CAR_OWNER: "api/v1/auth/create/car-owner",
    CREATE_DRIVER: "api/v1/auth/create/driver",
  },
  // Admin
  ADMIN: {
    GET_ALL_CARS: "api/v1/admin/getAllCars",
    APPROVE_CAR: (carId) => `api/v1/admin/approveCar/${carId}`,
    REJECT_CAR: (carId) => `api/v1/admin/rejectCar/${carId}`,
    GET_ALL_DRIVERS: "api/v1/admin/getAllDrivers",
    APPROVE_DRIVER: (driverId) => `api/v1/admin/approveDriver/${driverId}`,
    REJECT_DRIVER: (driverId) => `api/v1/admin/rejectDriver/${driverId}`,
  },
  // Customer
  CUSTOMER: {
    GET_AVAILABLE_CARS: "api/v1/customer/get-available-cars",
    BOOK_CAR: "api/v1/customer/book-car",
    RATE_RIDE: "api/v1/customer/rate-ride",
  },
  // Car Owner
  CAR_OWNER: {
    ADD_CAR: "api/v1/car-owner/add-car",
    UPDATE_CAR: (carId) => `api/v1/car-owner/update-car/${carId}`,
    GET_MY_CARS: "api/v1/car-owner/my-cars",
  },
  // Driver
  DRIVER: {
    END_RIDE: "api/v1/driver/end-ride",
    COMPLETE_RIDE: "api/v1/driver/complete-ride",
    DELETE_DRIVER: (driverId) => `api/v1/driver/deleteDriver/${driverId}`,
  },
  // CAR :
  CAR: {
    GET_CAR_DETAILS: (carId) => `api/v1/car/car-details/${carId}`,
    DELETE_CAR: (carId) => `api/v1/car/delete-car/${carId}`,
    GET_CITIES: "api/v1/car/cities",
    GET_CARS_BY_CITY: (city) => `api/v1/car/get-cars/${city}`,
  },
  // Booking
  BOOKING: {
    GET_BOOKING_HISTORY: "api/v1/booking/get-booking-history",
    GET_SINGLE_BOOKING: (bookingId) =>
      `api/v1/booking/get-single-booking/${bookingId}`,
    CANCEL_BOOKING: "api/v1/booking/cancel-booking",
  },
  // Upload
  UPLOAD: {
    UPLOAD_IMAGE: "api/v1/upload/upload-image",
  },
  LOCATION: {
    SEARCH: "api/location/search",
    REVERSE: "api/location/reverse",
  },
};
