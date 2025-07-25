import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaSpinner,
  FaCheckCircle,
  FaArrowLeft,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

const OTPVerificationForm = ({
  formData,
  errors,
  loading,
  roleConfig,
  role,
  onInputChange,
  onSubmit,
  onResendOTP,
  onBack,
  otpRetries = 0,
  maxRetries = 3,
}) => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ✅ Reset countdown when component mounts or OTP is resent
  useEffect(() => {
    setCountdown(60);
    setCanResend(false);
  }, [formData.email]); // Reset when email changes (new registration)

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResend = () => {
    onResendOTP();
    setCountdown(60); // ✅ Reset countdown
    setCanResend(false);
  };

  const handleOTPInput = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 4) {
      onInputChange({
        target: {
          name: "otp",
          value: value,
        },
      });
    }
  };

  // ✅ Get retry status - Fix negative attempts issue
  const remainingAttempts = Math.max(0, maxRetries - otpRetries); // Ensure never negative
  const isLastAttempt = remainingAttempts === 1;
  const hasRetries = otpRetries > 0 && remainingAttempts > 0; // Only show if there are actual remaining attempts

  return (
    <div className="bg-white/90 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/50">
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <FaEnvelope className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h3>
        <p className="text-sm text-gray-600">
          We've sent a 4-digit verification code to
        </p>
        <p className="text-sm font-semibold text-blue-600 mt-1">
          {formData.email}
        </p>

        {/* ✅ Show retry status - Fixed logic */}
        {hasRetries && (
          <div
            className={`mt-3 p-2 rounded-lg ${
              isLastAttempt ? "bg-red-50" : "bg-amber-50"
            }`}
          >
            <div className="flex items-center justify-center">
              <FaExclamationTriangle
                className={`mr-2 ${
                  isLastAttempt ? "text-red-500" : "text-amber-500"
                }`}
              />
              <p
                className={`text-xs font-medium ${
                  isLastAttempt ? "text-red-700" : "text-amber-700"
                }`}
              >
                {isLastAttempt
                  ? `Last attempt remaining! After this, you'll need to restart registration.`
                  : `${remainingAttempts} ${
                      remainingAttempts === 1 ? "attempt" : "attempts"
                    } remaining`}
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* OTP Input Field */}
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-semibold text-gray-700 mb-3 text-center"
          >
            Enter Verification Code
          </label>
          <div className="flex justify-center">
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.otp}
              onChange={handleOTPInput}
              className={`text-center text-2xl font-bold tracking-widest w-32 px-4 py-3 border-2 ${
                errors.otp
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300 bg-white`}
              placeholder="- - - -"
              maxLength="4"
              autoComplete="one-time-code"
              autoFocus
              disabled={loading}
            />
          </div>
          {errors.otp && (
            <p className="mt-3 text-sm text-red-600 flex items-center justify-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {errors.otp}
            </p>
          )}
        </div>

        {/* Resend OTP Section */}
        <div className="text-center">
          {!canResend ? (
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <FaClock className="mr-2" />
              Resend code in {countdown}s
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Didn't receive the code? Resend OTP
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading || formData.otp.length !== 4}
            className={`group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r ${roleConfig.gradient} hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <span>Verify & Create Account</span>
                <FaCheckCircle className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>

        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaArrowLeft className="mr-2" />
            Back to Registration
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Check your spam folder if you don't see the email
        </p>
        {/* ✅ Show role info during OTP */}
        <p className="text-xs text-gray-400 mt-1">
          Creating {roleConfig.title.toLowerCase()} account
        </p>
      </div>
    </div>
  );
};

export default OTPVerificationForm;
