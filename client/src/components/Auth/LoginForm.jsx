import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaSignInAlt,
  FaEnvelope,
  FaLock,
} from "react-icons/fa"; // ✅ Added FaEnvelope and FaLock

const LoginForm = ({
  formData,
  errors,
  loading,
  roleConfig,
  role,
  onInputChange,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/50">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Email Field */}
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
            autoComplete="email"
            value={formData.email}
            onChange={onInputChange}
            className={`appearance-none block w-full px-4 py-3 border-2 ${
              errors.email
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300 text-base bg-white`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
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
              autoComplete="current-password"
              value={formData.password}
              onChange={onInputChange}
              className={`appearance-none block w-full px-4 py-3 pr-12 border-2 ${
                errors.password
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300 text-base bg-white`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-blue-600 transition duration-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-400" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {errors.password}
            </p>
          )}
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
                Signing In...
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FaSignInAlt className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>

        {/* Sign Up Link */}
        {role !== "admin" && (
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to={`/signup/${role}`}
                className="font-semibold text-blue-600 hover:text-blue-500 transition duration-300"
              >
                Sign up here
              </Link>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
