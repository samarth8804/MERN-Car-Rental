import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaHeadset,
  FaQuestionCircle,
  FaBug,
  FaHandshake,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaUser,
  FaComment,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "../../context/UserContext";
import Navbar from "../../components/layouts/Navbar";
import Footer from "../../components/layouts/Footer";

const Contact = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Smart back navigation
  const handleBackNavigation = () => {
    if (isAuthenticated && user?.role) {
      navigate(`/dashboard/${user.role}`);
    } else {
      navigate("/");
    }
  };

  // Contact methods - Updated location
  const contactMethods = [
    {
      icon: FaPhone,
      title: "Call Us",
      description: "Speak with our support team",
      value: "+91 9876543210",
      link: "tel:+919876543210",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      description: "Send us a detailed message",
      value: "support@easygo.com",
      link: "mailto:support@easygo.com",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      description: "Our office location",
      value: "Indore, Madhya Pradesh, India",
      link: "#",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconColor: "text-purple-600",
      textColor: "text-purple-800",
    },
    {
      icon: FaClock,
      title: "Business Hours",
      description: "We're available",
      value: "24/7 Support",
      link: "#",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
      textColor: "text-orange-800",
    },
  ];

  // Social media links
  const socialLinks = [
    { icon: FaFacebook, url: "#", color: "text-blue-600" },
    { icon: FaTwitter, url: "#", color: "text-sky-500" },
    { icon: FaInstagram, url: "#", color: "text-pink-600" },
    { icon: FaLinkedin, url: "#", color: "text-blue-700" },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar isDashboard={false} />

      {/* Hero Section with Back Button */}
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
            Contact <span className="text-yellow-300">Us</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed">
            We're here to help! Get in touch with our team for any questions,
            support, or feedback about easyGo services.
          </p>

          {/* Quick contact stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center group">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                <FaHeadset className="text-3xl text-yellow-300" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                24/7
              </div>
              <div className="text-blue-100 text-lg">Support Available</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                <FaGlobe className="text-3xl text-yellow-300" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                25+
              </div>
              <div className="text-blue-100 text-lg">Cities Served</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                <FaCheckCircle className="text-3xl text-yellow-300" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                &lt;2hr
              </div>
              <div className="text-blue-100 text-lg">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose the best way to reach us. We're committed to providing you
              with quick and helpful responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${method.bgColor} rounded-2xl p-8 border-2 ${method.borderColor} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer`}
                  onClick={() =>
                    method.link !== "#" && window.open(method.link)
                  }
                >
                  <div
                    className={`w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                  >
                    <IconComponent className={`text-2xl ${method.iconColor}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${method.textColor} mb-2`}>
                    {method.title}
                  </h3>
                  <p className={`${method.textColor} opacity-80 mb-4 text-sm`}>
                    {method.description}
                  </p>
                  <p className={`${method.textColor} font-semibold`}>
                    {method.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Info & Social Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Office Hours */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">
                Office Hours
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-semibold text-gray-900">
                    9:00 AM - 8:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-semibold text-gray-900">
                    10:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-semibold text-gray-900">
                    Emergency Only
                  </span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Emergency Support</span>
                    <span className="font-semibold text-blue-600">24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-6">Need Quick Help?</h4>
              <p className="text-blue-100 mb-6">
                Check out our frequently asked questions for instant answers to
                common queries.
              </p>
              <button
                onClick={() => navigate("/faqs")}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Visit FAQ Section
              </button>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">
                Follow Us
              </h4>
              <p className="text-gray-600 mb-6">
                Stay connected with us on social media for updates, tips, and
                community discussions.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center ${social.color} hover:bg-gray-200 transition-colors`}
                    >
                      <IconComponent className="text-xl" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Support Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Can We Help?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our support team is ready to assist you with various types of
              inquiries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaQuestionCircle className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                General Inquiry
              </h3>
              <p className="text-gray-600 leading-relaxed">
                General questions about our services and platform
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaHeadset className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Booking Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Help with bookings, reservations, and modifications
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaBug className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Technical Issue
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Report technical problems or bugs on our platform
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaHandshake className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Partnership
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Business partnerships and collaboration opportunities
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

export default Contact;
