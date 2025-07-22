import { FaSpinner } from "react-icons/fa";

const AppLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-3">
            <span className="text-3xl">🚗</span>
          </div>
          <h1 className="text-4xl font-bold text-white">easyGo</h1>
        </div>

        <FaSpinner className="animate-spin text-4xl text-white mx-auto mb-4" />
        <p className="text-white text-lg">Starting your journey...</p>
      </div>
    </div>
  );
};

export default AppLoader;
