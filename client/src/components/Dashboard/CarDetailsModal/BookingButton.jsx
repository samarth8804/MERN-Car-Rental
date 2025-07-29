import { FaCar } from "react-icons/fa";

const BookingButton = ({ onBookCar, car, hasSelectedDates }) => {
  return (
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
  );
};

export default BookingButton;
