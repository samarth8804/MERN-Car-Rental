import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa";

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Link to="/" className="flex items-center group">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
          <FaCar className="text-2xl" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
          easyGo
        </h1>
      </Link>
    </div>
  );
};

export default Logo;
