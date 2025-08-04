import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaQuestionCircle,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaCar,
  FaUsers,
  FaUserTie,
  FaHeadset,
  FaBug,
  FaShieldAlt,
  FaCreditCard,
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";
import { GiHomeGarage } from "react-icons/gi";
import { useAuth } from "../../context/UserContext";
import Navbar from "../../components/layouts/Navbar";
import Footer from "../../components/layouts/Footer";

const FAQs = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState({});

  // Smart back navigation
  const handleBackNavigation = () => {
    if (isAuthenticated && user?.role) {
      navigate(`/dashboard/${user.role}`);
    } else {
      navigate("/");
    }
  };

  // FAQ Categories
  const categories = [
    {
      id: "all",
      label: "All Questions",
      icon: FaQuestionCircle,
      color: "text-blue-600",
    },
    {
      id: "customer",
      label: "For Customers",
      icon: FaUsers,
      color: "text-green-600",
    },
    {
      id: "driver",
      label: "For Drivers",
      icon: FaUserTie,
      color: "text-purple-600",
    },
    {
      id: "carowner",
      label: "For Car Owners",
      icon: GiHomeGarage,
      color: "text-orange-600",
    },
    {
      id: "booking",
      label: "Booking & Payment",
      icon: FaCreditCard,
      color: "text-indigo-600",
    },
    {
      id: "technical",
      label: "Technical Support",
      icon: FaBug,
      color: "text-red-600",
    },
  ];

  // FAQ Data
  const faqData = [
    // Customer FAQs
    {
      id: 1,
      category: "customer",
      question: "How do I book a car on easyGo?",
      answer:
        "To book a car: 1) Sign up as a customer, 2) Browse available cars in your city, 3) Select dates and filter by preferences, 4) Choose your preferred car, 5) Fill in booking details and payment information, 6) Confirm your booking. You'll receive a confirmation email with all details.",
    },
    {
      id: 2,
      category: "customer",
      question: "What documents do I need to provide for booking?",
      answer:
        "You need to provide: 1) Valid driving license, 2) Government-issued ID proof (Aadhar, Passport, etc.), 3) Credit/Debit card for payment. All documents are verified for your safety and security.",
    },
    {
      id: 3,
      category: "customer",
      question: "Can I cancel my booking? What's the cancellation policy?",
      answer:
        "Yes, you can cancel your booking. Free cancellation is available up to 24 hours before pickup. Cancellations within 24 hours may incur charges. Check your booking confirmation for specific terms.",
    },
    {
      id: 4,
      category: "customer",
      question: "What if the car breaks down during my trip?",
      answer:
        "Contact our 24/7 support immediately. We'll arrange roadside assistance or provide a replacement vehicle. Emergency support number is available in your booking confirmation and dashboard.",
    },
    {
      id: 5,
      category: "customer",
      question: "Are there any hidden charges?",
      answer:
        "No hidden charges! All costs are clearly displayed before booking including base rent, taxes, and any applicable fees. Additional charges may apply for extra kilometers, late returns, or damages.",
    },
    {
      id: 6,
      category: "customer",
      question: "In which cities is easyGo available?",
      answer:
        "easyGo is currently available in 25+ major cities across India including Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, and more. Check our website for the complete list.",
    },
    {
      id: 7,
      category: "customer",
      question: "What's the minimum age requirement for booking?",
      answer:
        "Customers must be at least 21 years old with a valid driving license (minimum 1 year old). Some premium cars may have higher age requirements (25 years). Age verification is done during registration.",
    },
    {
      id: 8,
      category: "customer",
      question: "What are your customer support hours?",
      answer:
        "Our customer support is available 24/7 for emergencies and urgent issues. General queries are handled Monday-Friday 9 AM-8 PM, Saturday 10 AM-6 PM. Sunday emergency support only.",
    },

    // Driver FAQs
    {
      id: 9,
      category: "driver",
      question: "How do I become a driver with easyGo?",
      answer:
        "Register as a driver on our platform, submit required documents (driving license, background verification, vehicle registration), complete verification process, and start accepting ride requests once approved.",
    },
    {
      id: 10,
      category: "driver",
      question: "What documents are required for driver registration?",
      answer:
        "Required documents: 1) Valid driving license (minimum 2 years old), 2) Vehicle registration certificate, 3) Vehicle insurance papers, 4) Police verification certificate, 5) Address proof, 6) Bank account details for payments.",
    },
    {
      id: 11,
      category: "driver",
      question: "How do driver payments work?",
      answer:
        "Drivers receive weekly payments directly to their registered bank account. Earnings include base fare, distance charges, and customer tips. Payment breakdown is available in your driver dashboard.",
    },
    {
      id: 12,
      category: "driver",
      question: "Can I work flexible hours as a driver?",
      answer:
        "Yes! Our platform offers complete flexibility. You can set your availability, accept or decline ride requests, and work according to your schedule. No minimum hour requirements.",
    },
    {
      id: 13,
      category: "driver",
      question: "What if a customer damages my vehicle?",
      answer:
        "Report any damage immediately through the app. We provide insurance coverage for damages caused during rides. Document damage with photos and contact support for claim processing.",
    },

    // Car Owner FAQs
    {
      id: 14,
      category: "carowner",
      question: "How can I list my car on easyGo?",
      answer:
        "Register as a car owner, upload car details and photos, submit required documents (registration, insurance, pollution certificate), pass vehicle inspection, and start earning once approved.",
    },
    {
      id: 15,
      category: "carowner",
      question: "What type of cars can I list?",
      answer:
        "We accept cars that are: 1) Less than 8 years old, 2) In good condition, 3) Have valid registration and insurance, 4) Pass our quality inspection. All car types welcome - hatchbacks to SUVs.",
    },
    {
      id: 16,
      category: "carowner",
      question: "How much can I earn by listing my car?",
      answer:
        "Earnings depend on car type, location, and demand. On average, car owners earn ₹8,000-₹25,000 per month. Premium cars in high-demand areas earn more. Check our earnings calculator for estimates.",
    },
    {
      id: 17,
      category: "carowner",
      question: "Is my car insured during rentals?",
      answer:
        "Yes, all listed cars are covered by comprehensive insurance during rental periods. This includes third-party liability and damage coverage. Your personal insurance remains unaffected.",
    },
    {
      id: 18,
      category: "carowner",
      question: "Who handles car maintenance and cleaning?",
      answer:
        "Basic maintenance and cleaning between rentals are handled by our team. Major repairs and regular servicing remain the owner's responsibility. We provide maintenance reminders and support.",
    },

    // Booking & Payment FAQs
    {
      id: 19,
      category: "booking",
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit/debit cards, UPI payments, net banking, and digital wallets. Payment is processed securely through encrypted gateways. No cash payments for bookings.",
    },
    {
      id: 20,
      category: "booking",
      question: "When is payment charged for bookings?",
      answer:
        "Payment is charged immediately upon booking confirmation. For longer bookings, we may charge in installments. Refunds for cancellations are processed within 5-7 business days.",
    },
    {
      id: 21,
      category: "booking",
      question: "Can I modify my booking after confirmation?",
      answer:
        "Yes, you can modify dates, pickup location, and some details up to 12 hours before pickup. Modification fees may apply depending on changes. Contact support for assistance.",
    },
    {
      id: 22,
      category: "booking",
      question: "What if I return the car late?",
      answer:
        "Late returns incur additional charges calculated hourly. Notify us in advance if you expect delays. Grace period of 30 minutes is provided for all bookings.",
    },
    {
      id: 23,
      category: "booking",
      question: "Can I extend my booking?",
      answer:
        "Yes, you can extend your booking if the car is available. Extension requests should be made through the app or by calling support. Additional charges apply for extended hours/days.",
    },
    {
      id: 24,
      category: "booking",
      question: "Can I book a car for someone else?",
      answer:
        "Yes, you can book for others, but the primary driver must be present during pickup with valid documents. Add additional drivers during booking if needed. All drivers must meet age and license requirements.",
    },

    // Technical Support FAQs
    {
      id: 25,
      category: "technical",
      question: "I'm having trouble logging into my account.",
      answer:
        "Try resetting your password using 'Forgot Password' link. Clear browser cache/cookies or try a different browser. If issues persist, contact technical support with your registered email.",
    },
    {
      id: 26,
      category: "technical",
      question: "The app is not working properly on my phone.",
      answer:
        "Ensure you have the latest app version. Check internet connectivity and restart the app. For persistent issues, try clearing app cache or reinstalling. Contact support with your device details.",
    },
    {
      id: 27,
      category: "technical",
      question: "I can't upload documents during registration.",
      answer:
        "Ensure documents are in JPG/PNG format and under 5MB size. Check camera permissions for mobile app. Try using a different browser or device. Contact support if problems continue.",
    },
    {
      id: 28,
      category: "technical",
      question: "Payment failed but money was deducted.",
      answer:
        "Payment failures with deductions are usually bank holds that reverse within 24-48 hours. Check your bank statement after 2 days. Contact support with transaction details if money isn't refunded.",
    },
    {
      id: 29,
      category: "technical",
      question: "How do I update my profile information?",
      answer:
        "Go to your dashboard, click on 'Profile' section, and edit required fields. Some changes like phone number may require verification. Save changes and check for confirmation email.",
    },
    {
      id: 30,
      category: "technical",
      question: "How do I contact customer support?",
      answer:
        "Contact us via: 1) Call +91 9876543210, 2) Email support@easygo.com, 3) In-app chat support, 4) WhatsApp support, 5) Visit our office in Indore. Emergency support available 24/7.",
    },
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Toggle FAQ item
  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Quick stats
  const stats = [
    { icon: FaQuestionCircle, number: "30+", label: "Common Questions" },
    { icon: FaHeadset, number: "24/7", label: "Support Available" },
    { icon: FaCheckCircle, number: "<2hr", label: "Response Time" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar isDashboard={false} />

      {/* Hero Section with Back Button */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 relative">
        {/* Back Button */}
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
            Frequently Asked <span className="text-yellow-300">Questions</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed">
            Find quick answers to common questions about easyGo services,
            booking process, and platform features. Can't find what you're
            looking for? Contact our support team.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                    <IconComponent className="text-3xl text-yellow-300" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 text-lg">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <IconComponent
                    className={
                      selectedCategory === category.id
                        ? "text-white"
                        : category.color
                    }
                  />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm ? "Search Results" : "All Questions"}
            </h2>
            <p className="text-gray-600">
              {filteredFAQs.length} question
              {filteredFAQs.length !== 1 ? "s" : ""} found
              {selectedCategory !== "all" &&
                ` in ${
                  categories.find((c) => c.id === selectedCategory)?.label
                }`}
            </p>
          </div>

          {/* FAQs List */}
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {openItems[faq.id] ? (
                      <FaChevronUp className="text-blue-600 flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {openItems[faq.id] && (
                    <div className="px-6 pb-5 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaQuestionCircle className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No questions found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse different categories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Show All Questions
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Can't find the answer you're looking for? Our support team is here
              to help you 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Phone Support */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaPhone className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Call Us</h3>
              <p className="text-gray-600 mb-4">
                Speak directly with our support team
              </p>
              <a
                href="tel:+919876543210"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                +91 9876543210
              </a>
            </div>

            {/* Email Support */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaEnvelope className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us a detailed message</p>
              <a
                href="mailto:support@easygo.com"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                support@easygo.com
              </a>
            </div>

            {/* Live Chat */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaHeadset className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Live Chat
              </h3>
              <p className="text-gray-600 mb-4">Chat with us in real-time</p>
              <button className="text-purple-600 font-semibold hover:text-purple-700">
                Start Chat
              </button>
            </div>

            {/* Visit Office */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaMapMarkerAlt className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Visit Us</h3>
              <p className="text-gray-600 mb-4">Meet us at our office</p>
              <span className="text-orange-600 font-semibold">Indore, MP</span>
            </div>
          </div>

          {/* Contact Page CTA */}
          <div className="text-center mt-16">
            <button
              onClick={() => navigate("/contact")}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Contact Support Team
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQs;
