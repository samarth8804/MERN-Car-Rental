import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa";

const Logo = ({ className = "", disableLink = false, variant = "default" }) => {
  const logoContent = (
    <div className="flex items-center group">
      <div
        className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl mr-3 shadow-lg transition-all duration-300 ${
          !disableLink ? "group-hover:shadow-xl" : ""
        }`}
      >
        <FaCar className="text-2xl" />
      </div>
      <h1
        className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-transform duration-300 ${
          !disableLink ? "group-hover:scale-105" : ""
        } ${variant === "dashboard" ? "text-2xl" : ""}`}
      >
        easyGo
      </h1>
    </div>
  );

  return (
    <div className={`flex items-center ${className}`}>
      {disableLink ? (
        <div className="cursor-default">{logoContent}</div>
      ) : (
        <Link to="/">{logoContent}</Link>
      )}
    </div>
  );
};

export default Logo;
