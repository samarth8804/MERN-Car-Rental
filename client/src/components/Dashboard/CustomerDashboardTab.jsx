const CustomerDashboardTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Tabs */}
        <div className="hidden md:flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 group ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <tab.icon className="group-hover:scale-110 transition-transform duration-200" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Mobile Tab Selector */}
        <div className="md:hidden py-4">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label} {tab.badge ? `(${tab.badge})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardTabs;
