import { FaShieldAlt, FaBolt, FaHeadset } from "react-icons/fa";

const FeaturesSection = () => {
  const features = [
    {
      icon: FaShieldAlt,
      title: "Secure & Safe",
      description:
        "Your data and transactions are protected with enterprise-level security measures.",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      icon: FaBolt,
      title: "Fast & Reliable",
      description:
        "Quick booking process and reliable service you can count on every time.",
      gradient: "from-green-400 to-green-600",
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to help you whenever you need assistance.",
      gradient: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">easyGo?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div
                  className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300 shadow-lg`}
                >
                  <IconComponent className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
