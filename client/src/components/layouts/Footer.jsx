import { Link } from "react-router-dom";
import { useAuth } from "../../context/UserContext";
import {
  FaCar,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const Footer = ({ onOpenRoleModal = null }) => {
  const { isAuthenticated } = useAuth();
  const socialLinks = [
    {
      icon: FaFacebookF,
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      icon: FaInstagram,
      bgColor: "bg-pink-600",
      hoverColor: "hover:bg-pink-700",
    },
    {
      icon: FaTwitter,
      bgColor: "bg-blue-400",
      hoverColor: "hover:bg-blue-500",
    },
  ];

  const quickLinks = [
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/faqs", label: "FAQs" },
  ];

  const contactInfo = [
    { icon: FaEnvelope, text: "support@easygo.com" },
    { icon: FaPhone, text: "+1 (555) 123-4567" },
    { icon: FaMapMarkerAlt, text: "Indore" },
    { icon: FaClock, text: "24/7 Available" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg">
                <FaCar className="text-xl" />
              </div>
              <span className="text-2xl font-bold">easyGo</span>
            </div>
            <p className="text-gray-400 text-lg mb-4 max-w-md">
              Your trusted partner for all mobility solutions. Rent, drive, or
              earn with our comprehensive platform.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <div
                    key={index}
                    className={`w-10 h-10 ${social.bgColor} rounded-full flex items-center justify-center ${social.hoverColor} cursor-pointer transition duration-300`}
                  >
                    <IconComponent className="text-white" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="hover:text-white transition duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {!isAuthenticated && (
                <li>
                  {onOpenRoleModal ? (
                    <button
                      onClick={() => onOpenRoleModal("signup")}
                      className="hover:text-white transition duration-300"
                    >
                      Get Started
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="hover:text-white transition duration-300"
                    >
                      Get Started
                    </Link>
                  )}
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <li key={index} className="flex items-center space-x-2">
                    <IconComponent />
                    <span>{contact.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 easyGo. All rights reserved. Made with ❤️ for better
            mobility.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
