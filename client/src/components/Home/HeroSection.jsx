import { FaCar, FaRocket, FaKey } from "react-icons/fa";
import { MdElectricCar, MdDirectionsCar } from "react-icons/md";
import { BsTruck } from "react-icons/bs";

const HeroSection = ({ onOpenRoleModal }) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <FaCar className="absolute top-10 left-10 text-6xl" />
        <BsTruck className="absolute top-32 right-20 text-4xl" />
        <MdDirectionsCar className="absolute bottom-20 left-20 text-5xl" />
        <MdElectricCar className="absolute bottom-32 right-10 text-4xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
          Your Journey <br />
          <span className="text-yellow-300">Starts Here</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
          Discover the freedom of mobility with easyGo's comprehensive car
          rental ecosystem. Rent, drive, or earn - the choice is yours!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => onOpenRoleModal("signup")}
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 hover:shadow-2xl transform hover:scale-105 transition duration-300 flex items-center justify-center space-x-2"
          >
            <FaRocket />
            <span>Get Started Today</span>
          </button>
          <button
            onClick={() => onOpenRoleModal("login")}
            className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition duration-300 flex items-center justify-center space-x-2"
          >
            <FaKey />
            <span>Already a Member?</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-300">
              10K+
            </div>
            <div className="text-blue-100">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-300">
              500+
            </div>
            <div className="text-blue-100">Available Cars</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-300">
              50+
            </div>
            <div className="text-blue-100">Cities Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-300">
              24/7
            </div>
            <div className="text-blue-100">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
