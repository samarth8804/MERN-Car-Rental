import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaSpinner,
  FaIdCard,
} from "react-icons/fa";
import TermsCheckbox from "./TermsCheckbox"; // ✅ Import terms checkbox

const SignupForm = ({
  formData,
  errors,
  loading,
  roleConfig,
  role,
  onInputChange,
  onTermsChange, // ✅ Added terms handler prop
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Helper function to format license display
  const formatLicenseDisplay = (value) => {
    if (!value) return "";
    const clean = value.replace(/[^A-Z0-9]/g, "");
    if (clean.length <= 4) return clean;
    if (clean.length <= 8) return `${clean.slice(0, 4)} ${clean.slice(4)}`;
    return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8)}`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/50">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullname"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            <FaUser className="inline mr-2 text-gray-500" />
            Full Name
          </label>
          <input
            id="fullname"
            name="fullname"
            type="text"
            value={formData.fullname}
            onChange={onInputChange}
            className={`appearance-none block w-full px-4 py-3 border-2 ${
              errors.fullname
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300 text-base bg-white`}
            placeholder="Enter your full name"
            disabled={loading}
          />
          {errors.fullname && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {errors.fullname}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            <FaEnvelope className="inline mr-2 text-gray-500" />
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            className={`appearance-none block w-full px-4 py-3 border-2 ${
              errors.email
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300 text-base bg-white`}
            placeholder="Enter your email address"
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            <FaPhone className="inline mr-2 text-gray-500" />
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onInputChange}
            className={`appearance-none block w-full px-4 py-3 border-2 ${
              errors.phone
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300 text-base bg-white`}
            placeholder="Enter 10-digit phone number"
            maxLength="10"
            disabled={loading}
          />
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {errors.phone}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            <FaMapMarkerAlt className="inline mr-2 text-gray-500" />
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={onInputChange}
            rows="3"
            className={`appearance-none block w-full px-4 py-3 border-2 ${
              errors.address
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300 text-base bg-white resize-none`}
            placeholder="Enter your complete address"
            disabled={loading}
          />
          {errors.address && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {errors.address}
            </p>
          )}
        </div>

        {/* License Number Field (for drivers only) */}
        {role === "driver" && (
          <div>
            <label
              htmlFor="licenseNumber"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              <FaIdCard className="inline mr-2 text-gray-500" />
              Driving License Number
            </label>
            <input
              id="licenseNumber"
              name="licenseNumber"
              type="text"
              value={formData.licenseNumber}
              onChange={onInputChange}
              className={`appearance-none block w-full px-4 py-3 border-2 ${
                errors.licenseNumber
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300 text-base bg-white font-mono tracking-wider`}
              placeholder="e.g., AB122023 1234567"
              maxLength="15"
              style={{ textTransform: "uppercase" }}
              disabled={loading}
            />

            {/* Show formatted preview */}
            {formData.licenseNumber && (
              <p className="mt-1 text-xs text-gray-500">
                Format: {formatLicenseDisplay(formData.licenseNumber)}
              </p>
            )}

            {/* Show format hint */}
            <p className="mt-1 text-xs text-gray-400">
              Format: State Code (2) + RTO Code (2) + Year (4) + Serial (7)
            </p>

            {errors.licenseNumber && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <span className="w-4 h-4 mr-1">⚠️</span>
                {errors.licenseNumber}
              </p>
            )}
          </div>
        )}

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            <FaLock className="inline mr-2 text-gray-500" />
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={onInputChange}
              className={`appearance-none block w-full px-4 py-3 pr-12 border-2 ${
                errors.password
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300 text-base bg-white`}
              placeholder="Create a strong password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            <FaLock className="inline mr-2 text-gray-500" />
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={onInputChange}
              className={`appearance-none block w-full px-4 py-3 pr-12 border-2 ${
                errors.confirmPassword
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300 text-base bg-white`}
              placeholder="Confirm your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={loading}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* ✅ Terms and Conditions Checkbox */}
        <div>
          <TermsCheckbox
            checked={formData.acceptTerms}
            onChange={onTermsChange}
            error={errors.acceptTerms}
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r ${roleConfig.gradient} hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <span>Continue to Verification</span>
                <FaUserPlus className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
