const WelcomeHeader = ({ isSignup = false }) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
        {isSignup ? "Join Us Today" : "Welcome Back!"}
      </h2>
      <p className="text-gray-600 text-lg">
        {isSignup
          ? "Experience hassle-free services and premium support."
          : "Sign in to continue your journey with us."}
      </p>
    </div>
  );
};

export default WelcomeHeader;
