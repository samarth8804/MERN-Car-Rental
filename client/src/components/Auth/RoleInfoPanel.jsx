import { FaCheck } from "react-icons/fa";

const RoleInfoPanel = ({ roleConfig }) => {
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Beautiful Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-700/90"></div>

      {/* Animated Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 py-12">
        {/* Hero Content */}
        <div className="mb-12">
          <div className="inline-flex items-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mr-4 border border-white/30">
              <roleConfig.icon className="text-3xl text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white/90 uppercase tracking-wide">
                {roleConfig.title} Portal
              </h3>
              <div className="w-12 h-1 bg-white/40 rounded-full mt-1"></div>
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {roleConfig.loginInfo.title}
          </h1>
          <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-lg">
            {roleConfig.loginInfo.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4">
          {roleConfig.loginInfo.highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <FaCheck className="text-white text-sm" />
              </div>
              <span className="text-white font-medium">{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleInfoPanel;
