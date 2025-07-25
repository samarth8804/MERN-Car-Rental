import { useEffect } from "react";
import { FaTimes, FaShieldAlt, FaFileContract } from "react-icons/fa";

const TermsAndPrivacyDialog = ({ isOpen, onClose, type = "terms" }) => {
  // Handle escape key press only
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = {
    terms: {
      title: "Terms and Conditions",
      icon: <FaFileContract className="text-blue-600 text-xl" />,
      content: `
        Welcome to easyGo Car Rental Service. By using our platform, you agree to the following terms:

        1. ACCEPTANCE OF TERMS
        By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.

        2. ELIGIBILITY
        - You must be at least 18 years old to use our service
        - You must have a valid driver's license for your respective role
        - You must provide accurate and truthful information during registration
        - Car owners must have valid vehicle registration and insurance

        3. RENTAL TERMS
        - All rentals are subject to availability and owner approval
        - Rental rates are determined by car owners and subject to change
        - Security deposit may be required for vehicle rentals
        - Late returns may incur additional charges as specified by the car owner
        - Minimum rental period may apply depending on the vehicle

        4. USER RESPONSIBILITIES
        Customer Responsibilities:
        - Drivers are responsible for all traffic violations during rental period
        - Any damage to the vehicle must be reported immediately to the car owner
        - Vehicles must be returned in the same condition as received
        - Fuel level should match the level at pickup unless otherwise agreed

        Car Owner Responsibilities:
        - Ensure vehicles are in safe, roadworthy condition
        - Provide accurate vehicle descriptions and photos
        - Maintain valid insurance and registration
        - Be available for vehicle handover and return

        Driver Responsibilities:
        - Maintain valid driving license and clean driving record
        - Follow all traffic rules and regulations
        - Complete assigned trips professionally and on time
        - Maintain vehicle cleanliness during service period

        5. PROHIBITED USES
        - Using vehicles for illegal activities or unauthorized purposes
        - Subletting or transferring rental agreements to third parties
        - Driving under the influence of alcohol, drugs, or any impairing substances
        - Using vehicles for racing, off-road driving, or dangerous activities
        - Smoking or carrying prohibited substances in vehicles

        6. PAYMENT AND CANCELLATION POLICY
        - Payment must be completed before vehicle handover
        - Cancellations must be made at least 24 hours in advance
        - Cancellation fees may apply as per the car owner's policy
        - Refunds are processed within 5-7 business days
        - Platform charges are non-refundable

        7. LIABILITY AND INSURANCE
        - easyGo acts as a platform facilitating connections between users
        - Users are responsible for their own insurance coverage
        - easyGo is not liable for any personal injury or property damage during rental period
        - Disputes between users should be resolved directly or through our mediation service

        8. PLATFORM FEES
        - Service fees apply to all transactions
        - Fees are clearly disclosed before payment
        - Additional charges may apply for premium services

        9. ACCOUNT TERMINATION
        - Accounts may be suspended for violation of terms
        - Users may delete their accounts at any time
        - Data retention policies apply after account deletion

        10. MODIFICATIONS
        We reserve the right to modify these terms at any time. Users will be notified of significant changes. Continued use constitutes acceptance of modified terms.

        By clicking "I Agree", you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
      `,
    },
    privacy: {
      title: "Privacy Policy",
      icon: <FaShieldAlt className="text-green-600 text-xl" />,
      content: `
        At easyGo, we are committed to protecting your privacy and personal information. This policy explains how we collect, use, and safeguard your data.

        1. INFORMATION WE COLLECT
        Personal Information:
        - Name, email address, phone number, and address
        - Driver's license information (for drivers and customers)
        - Vehicle registration details (for car owners)
        - Payment information and transaction history
        - Profile photos and identity verification documents

        Usage Data:
        - App usage patterns and preferences
        - Location data when using our services
        - Device information and IP addresses
        - Communication records with other users and support

        2. HOW WE USE YOUR INFORMATION
        Service Provision:
        - To create and manage your account
        - To facilitate bookings and rentals
        - To process payments and transactions
        - To verify identity and prevent fraud

        Communication:
        - To send booking confirmations and updates
        - To provide customer support
        - To send important service announcements
        - To share promotional offers (with your consent)

        Platform Improvement:
        - To analyze usage patterns and improve our services
        - To develop new features and functionalities
        - To ensure platform security and prevent abuse

        3. INFORMATION SHARING
        We do not sell, trade, or share your personal information with third parties except in the following circumstances:

        Service Providers:
        - Payment processors for transaction handling
        - Cloud storage providers for data backup
        - Analytics services for platform improvement
        - Customer support tools for service delivery

        Legal Requirements:
        - When required by law or legal process
        - To protect our rights and prevent fraud
        - In case of emergency to protect user safety

        Other Users:
        - Basic profile information for booking purposes
        - Contact information for rental coordination
        - Reviews and ratings (anonymized when possible)

        4. DATA SECURITY
        Security Measures:
        - Industry-standard encryption for data transmission
        - Secure servers with regular security updates
        - Multi-factor authentication options
        - Regular security audits and vulnerability assessments

        Access Control:
        - Limited employee access to personal data
        - Strict data handling procedures
        - Regular security training for staff
        - Secure data disposal practices

        5. YOUR PRIVACY RIGHTS
        You have the right to:
        - Access your personal information we hold
        - Request correction of inaccurate data
        - Request deletion of your data (subject to legal requirements)
        - Object to certain data processing activities
        - Withdraw consent for optional data uses
        - Data portability for your personal information

        6. COOKIES AND TRACKING
        We use cookies and similar technologies to:
        - Remember your preferences and settings
        - Analyze website traffic and usage patterns
        - Provide personalized content and recommendations
        - Enable social media features and advertisements

        You can control cookie settings through your browser preferences.

        7. DATA RETENTION
        We retain your information only as long as necessary to:
        - Provide our services effectively
        - Comply with legal obligations
        - Resolve disputes and enforce agreements
        - Maintain transaction records for financial compliance

        Inactive accounts may be deleted after 2 years of inactivity.

        8. INTERNATIONAL DATA TRANSFERS
        Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.

        9. CHILDREN'S PRIVACY
        Our services are not intended for users under 18 years of age. We do not knowingly collect personal information from children.

        10. CHANGES TO PRIVACY POLICY
        We may update this privacy policy to reflect changes in our practices or legal requirements. We will notify users of material changes through email or app notifications.

        11. CONTACT INFORMATION
        For privacy-related questions or concerns, contact us at:
        - Email: privacy@easygo.com
        - Phone: +1-XXX-XXX-XXXX
        - Address: [Company Address]

        By using our service, you consent to the collection and use of information as described in this privacy policy.
      `,
    },
  };

  const currentContent = content[type];

  // Handle backdrop click to close dialog
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // ✅ Full viewport overlay with highest z-index
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}
    >
      {/* Enhanced Backdrop with Blur Effect */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"></div>

      {/* ✅ Dialog Container - Truly centered in full viewport */}
      <div className="relative w-full max-w-5xl max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
          {/* Header - Fixed */}
          <div
            className={`bg-gradient-to-r ${
              type === "terms"
                ? "from-blue-500 to-blue-600"
                : "from-green-500 to-green-600"
            } text-white p-6 flex items-center justify-between flex-shrink-0`}
          >
            <div className="flex items-center space-x-3">
              {currentContent.icon}
              <h2 className="text-2xl font-bold">{currentContent.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 p-2 rounded-full flex items-center justify-center"
              aria-label="Close dialog"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* ✅ Scrollable Content Area */}
          <div
            className="overflow-y-auto bg-gray-50"
            style={{ maxHeight: "calc(90vh - 140px)" }}
          >
            <div className="p-8">
              <div className="prose prose-sm max-w-none bg-white rounded-xl p-8 shadow-sm">
                {currentContent.content.split("\n").map((paragraph, index) => {
                  if (paragraph.trim() === "") return null;

                  // Check if it's a main heading (starts with number and all caps)
                  const isMainHeading =
                    /^\d+\./.test(paragraph.trim()) &&
                    paragraph.trim().split(".")[1]?.trim().toUpperCase() ===
                      paragraph.trim().split(".")[1]?.trim();

                  // Check if it's a subheading (starts with letter and ends with colon)
                  const isSubHeading =
                    /^[A-Z].*:$/.test(paragraph.trim()) &&
                    !paragraph.includes("-");

                  // Check if it's a bullet point
                  const isBulletPoint = paragraph.trim().startsWith("-");

                  return (
                    <div
                      key={index}
                      className={`${
                        isMainHeading
                          ? "mt-8 mb-4"
                          : isSubHeading
                          ? "mt-6 mb-3"
                          : isBulletPoint
                          ? "mb-2"
                          : "mb-3"
                      }`}
                    >
                      <p
                        className={`${
                          isMainHeading
                            ? "font-bold text-gray-900 text-lg border-b border-gray-200 pb-2"
                            : isSubHeading
                            ? "font-semibold text-gray-800 text-base"
                            : isBulletPoint
                            ? "text-gray-700 text-sm leading-relaxed ml-4"
                            : "text-gray-700 text-sm leading-relaxed"
                        }`}
                      >
                        {paragraph.trim()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="bg-white border-t border-gray-200 px-8 py-6 flex justify-between items-center flex-shrink-0">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className={`px-6 py-2 text-white rounded-lg font-medium transition-colors ${
                  type === "terms"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyDialog;
