import { FaStar, FaCar, FaMapMarkerAlt } from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";

const CarsCard = ({
  car,
  onBookClick,
  showBookButton = true,
  buttonText = "Book Now",
  buttonAction = "signup",
}) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 overflow-hidden border hover:border-blue-200">
      {/* Car Image */}
      <div className="relative h-48 overflow-hidden">
        {car.imageUrl ? (
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback gradient background with car icon */}
        <div
          className={`${
            car.imageUrl ? "hidden" : "flex"
          } absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center`}
          style={{ display: car.imageUrl ? "none" : "flex" }}
        >
          <MdDirectionsCar className="text-6xl text-white group-hover:scale-110 transition duration-300" />
        </div>

        {/* Rating badge */}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
          <div className="flex items-center space-x-1">
            <FaStar className="text-yellow-400" />
            <span className="font-medium text-gray-900">4.5</span>
          </div>
        </div>
      </div>

      {/* Car Details */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-500">
              {car.year} • {car.licensePlate}
            </p>
            {/* ✅ ADD CITY DISPLAY */}
            {car.city && (
              <div className="flex items-center text-sm text-blue-600 mt-1">
                <FaMapMarkerAlt className="mr-1" />
                <span>{car.city}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-2xl font-bold text-green-600 mb-2">
            ₹{car.pricePerDay}/day
          </div>
          <div className="text-sm text-gray-500 mb-3">₹{car.pricePerKm}/km</div>
        </div>

        {showBookButton && (
          <button
            onClick={() => onBookClick(buttonAction, car)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center space-x-2"
          >
            <FaCar />
            <span>{buttonText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CarsCard;
