import { FaCheckCircle, FaStar } from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";

const CarImageSection = ({ car, imageLoaded, setImageLoaded }) => {
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-lg border border-white/50">
      {car.imageUrl ? (
        <>
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
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
            <p className="text-blue-500 text-sm mt-1">No image available</p>
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 border border-green-400/50">
          <FaCheckCircle className="w-4 h-4" />
          <span>Available</span>
        </div>
      </div>

      {/* Rating Badge */}
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
  );
};

export default CarImageSection;
