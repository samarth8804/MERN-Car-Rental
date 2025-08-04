import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCar,
  FaUsers,
  FaShieldAlt,
  FaHandshake,
  FaCheckCircle,
  FaAward,
  FaGlobe,
  FaHeart,
  FaUserTie,
  FaRegUser,
  FaCog,
} from "react-icons/fa";
import { GiHomeGarage } from "react-icons/gi";
import { useAuth } from "../../context/UserContext";
import Navbar from "../../components/layouts/Navbar";
import Footer from "../../components/layouts/Footer";
import { roles } from "../../utils/data"; // Import from data.js

const About = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Smart back navigation
  const handleBackNavigation = () => {
    if (isAuthenticated && user?.role) {
      navigate(`/dashboard/${user.role}`);
    } else {
      navigate("/");
    }
  };

  // Company stats
  const stats = [
    { icon: FaCar, number: "500+", label: "Vehicles Available" },
    { icon: FaUsers, number: "10K+", label: "Happy Customers" },
    { icon: FaGlobe, number: "25+", label: "Cities Covered" },
    { icon: FaAward, number: "5+", label: "Years Experience" },
  ];

  // Core values
  const values = [
    {
      icon: FaShieldAlt,
      title: "Safety First",
      description:
        "All our vehicles undergo rigorous safety checks and maintenance to ensure your peace of mind.",
    },
    {
      icon: FaHandshake,
      title: "Trust & Reliability",
      description:
        "We build lasting relationships through transparent pricing and reliable service.",
    },
    {
      icon: FaHeart,
      title: "Customer Focus",
      description:
        "Your satisfaction is our priority. We're available 24/7 to assist with any concerns.",
    },
    {
      icon: FaCheckCircle,
      title: "Quality Assurance",
      description:
        "We maintain the highest standards in everything we do, from vehicles to service.",
    },
  ];

  // Enhanced service offerings using roles from data.js with bluish theme
  const serviceOfferings = roles
    .filter((role) => role.id !== "admin")
    .map((role, index) => {
      const IconComponent = role.icon;
      const gradientMap = {
        0: {
          bg: "from-blue-50 to-blue-100",
          border: "border-blue-200",
          text: "text-blue-800",
          icon: "from-blue-600 to-blue-700",
        },
        1: {
          bg: "from-indigo-50 to-indigo-100",
          border: "border-indigo-200",
          text: "text-indigo-800",
          icon: "from-indigo-600 to-indigo-700",
        },
        2: {
          bg: "from-sky-50 to-sky-100",
          border: "border-sky-200",
          text: "text-sky-800",
          icon: "from-sky-600 to-sky-700",
        },
      };
      const colors = gradientMap[index] || gradientMap[0];

      return {
        icon: IconComponent,
        title: `For ${role.title}s`,
        description: role.description,
        gradient: colors.icon,
        bgGradient: colors.bg,
        borderColor: colors.border,
        textColor: colors.text,
        loginInfo: role.loginInfo,
        features: role.loginInfo.highlights,
      };
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar isDashboard={false} />

      {/* Hero Section with Back Button - Updated with blue theme */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 relative">
        {/* Back Button - Positioned within hero */}
        <div className="absolute top-6 left-4 sm:left-6 lg:left-8 z-10">
          <button
            onClick={handleBackNavigation}
            className="flex items-center space-x-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-medium transition-all duration-200 backdrop-blur-sm"
          >
            <FaArrowLeft />
            <span>Back to {isAuthenticated ? "Dashboard" : "Home"}</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            About <span className="text-yellow-300">easyGo</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed">
            Revolutionizing mobility with a comprehensive car rental ecosystem
            that connects customers, drivers, and car owners seamlessly across
            India.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                    <IconComponent className="text-3xl text-yellow-300" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 text-lg">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Our Story */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Founded with a vision to transform the car rental industry,
                  easyGo emerged from the simple idea that mobility should be
                  accessible, affordable, and reliable for everyone.
                </p>
                <p>
                  What started as a small initiative has grown into a
                  comprehensive platform that serves three distinct communities:
                  customers seeking convenient transportation, drivers looking
                  to earn income, and car owners wanting to monetize their
                  vehicles.
                </p>
                <p>
                  Today, easyGo stands as a testament to innovation in the
                  sharing economy, connecting thousands of users across multiple
                  cities while maintaining our core commitment to safety,
                  reliability, and customer satisfaction.
                </p>
              </div>

              {/* Key highlights - Updated with blue theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-blue-600 text-sm" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Trusted Platform
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-blue-600 text-sm" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Pan-India Service
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-blue-600 text-sm" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    24/7 Support
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-blue-600 text-sm" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Verified Fleet
                  </span>
                </div>
              </div>
            </div>

            {/* Our Mission - Updated with blue theme */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                    <FaGlobe className="text-3xl text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
                </div>
                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                  To create a sustainable mobility ecosystem that empowers
                  individuals, reduces transportation costs, and promotes
                  efficient vehicle utilization while maintaining the highest
                  standards of safety and service quality.
                </p>

                {/* Mission goals */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                    <span className="text-blue-100">
                      Empower communities through mobility
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                    <span className="text-blue-100">
                      Promote sustainable transportation
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                    <span className="text-blue-100">
                      Drive economic opportunities
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section - Updated with blue theme */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The principles that guide every decision we make and every service
              we provide to our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Offer Section - Enhanced with blue theme */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A comprehensive platform designed to meet diverse mobility needs
              with three distinct service offerings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {serviceOfferings.map((offering, index) => {
              const IconComponent = offering.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${offering.bgGradient} rounded-3xl p-8 border-2 ${offering.borderColor} hover:shadow-xl transition-all duration-300 group`}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${offering.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="text-white text-2xl" />
                  </div>
                  <h3
                    className={`text-2xl font-bold ${offering.textColor} mb-4`}
                  >
                    {offering.title}
                  </h3>
                  <p
                    className={`${offering.textColor} mb-4 opacity-80 leading-relaxed`}
                  >
                    {offering.loginInfo.subtitle}
                  </p>
                  <p
                    className={`${offering.textColor} mb-6 opacity-70 text-sm leading-relaxed`}
                  >
                    {offering.description}
                  </p>

                  <ul className="space-y-3">
                    {offering.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <FaCheckCircle
                          className={`${offering.textColor} text-sm opacity-60`}
                        />
                        <span
                          className={`${offering.textColor} opacity-80 text-sm`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Journey Section - Updated with blue theme */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose your role and start your journey with easyGo today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles
              .filter((role) => role.id !== "admin")
              .map((role, index) => {
                const IconComponent = role.icon;
                return (
                  <div
                    key={role.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onClick={() => !isAuthenticated && navigate("/")}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${role.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="text-white text-xl" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {role.loginInfo.title}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {role.loginInfo.subtitle}
                    </p>
                    {!isAuthenticated && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                          Get Started →
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Ready to Get Started Section - Updated with blue theme */}
      <section className="py-24 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Decorative element */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8">
            <FaHeart className="text-white text-2xl" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-12 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied users and experience the future of
            mobility with easyGo. Whether you're looking to travel, drive, or
            rent out your vehicle, we've got you covered.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Your Journey
              </button>
              <button
                onClick={() => navigate("/")}
                className="border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          ) : (
            <button
              onClick={handleBackNavigation}
              className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Back to Dashboard
            </button>
          )}

          {/* Additional trust indicators - Updated with blue theme */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Secure & Safe
              </h4>
              <p className="text-gray-600 text-sm">
                Your safety and security are our top priorities
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Verified Fleet
              </h4>
              <p className="text-gray-600 text-sm">
                All vehicles undergo thorough inspection
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Customer First
              </h4>
              <p className="text-gray-600 text-sm">
                24/7 support for all your needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
