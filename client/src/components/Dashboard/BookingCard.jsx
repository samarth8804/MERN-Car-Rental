import {
  FaCar,
  FaIdCard,
  FaRupeeSign,
  FaMapPin,
  FaCalendarAlt,
  FaEye,
  FaSpinner,
  FaTimes as FaCancelIcon,
  FaPhone,
} from "react-icons/fa";
import {
  getBookingStatus,
  canCancelBooking,
} from "../../utils/dashboard/bookingUtils";
import { formatDateTimeIndian } from "../../utils/dashboard/dateUtils";

const BookingCard = ({
  booking,
  onViewDetails,
  onCancelBooking,
  cancellingBooking,
}) => {
  const statusInfo = getBookingStatus(booking);
  const StatusIcon = statusInfo.icon;
  const canCancel = canCancelBooking(booking);

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onViewDetails(booking._id)}
    >
      <div className="p-6">
        {/* Booking Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-gray-600">
              <FaIdCard className="text-blue-500" />
              <span className="text-sm font-medium">
                #{booking._id?.slice(-8).toUpperCase()}
              </span>
            </div>
            <div
              className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
            >
              <StatusIcon />
              <span>{statusInfo.status}</span>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 text-right">
            <div className="flex items-center space-x-1 text-green-600 font-bold text-lg">
              <FaRupeeSign className="text-base" />
              <span>{booking.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Car Information */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <FaCar className="text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.car?.brand} {booking.car?.model}
            </h3>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600 text-sm">
              {booking.car?.licensePlate}
            </span>
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <FaMapPin className="text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Pickup</p>
                <p className="text-gray-600 text-xs">
                  {booking.pickupLocation?.address}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <FaMapPin className="text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Drop-off</p>
                <p className="text-gray-600 text-xs">
                  {booking.dropLocation?.address}
                </p>
              </div>
            </div>
          </div>

          {/* Date & Time Information */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-blue-500" />
              <div>
                <p className="font-medium text-gray-700">Start Date</p>
                <p className="text-gray-600 text-xs">
                  {formatDateTimeIndian(booking.startDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-orange-500" />
              <div>
                <p className="font-medium text-gray-700">End Date</p>
                <p className="text-gray-600 text-xs">
                  {formatDateTimeIndian(booking.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <span>
            <span className="font-medium">Type:</span> {booking.bookingType}
          </span>
          <span>
            <span className="font-medium">AC:</span>{" "}
            {booking.isAC ? "Yes" : "No"}
          </span>
          {booking.driver && (
            <span>
              <span className="font-medium">Driver:</span> Included
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(booking._id);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            <FaEye />
            <span>View Details</span>
          </button>

          {canCancel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelBooking(booking._id);
              }}
              disabled={cancellingBooking === booking._id}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50"
            >
              {cancellingBooking === booking._id ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaCancelIcon />
              )}
              <span>
                {cancellingBooking === booking._id ? "Cancelling..." : "Cancel"}
              </span>
            </button>
          )}

          {booking.car?.owner?.phone && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`tel:${booking.car.owner.phone}`);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
            >
              <FaPhone />
              <span>Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
