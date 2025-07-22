import { FaTimes, FaCog } from "react-icons/fa";

const RoleSelectionModal = ({
  isOpen,
  onClose,
  authType,
  roles,
  onRoleSelect,
}) => {
  if (!isOpen) return null;

  // Filter roles based on authType - exclude admin for signup
  const getAvailableRoles = () => {
    if (authType === "signup") {
      return roles.filter((role) => role.id !== "admin");
    }
    return roles;
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
        }}
      ></div>

      {/* Modal container */}
      <div className="relative flex items-center justify-center min-h-full p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Choose Your Role
                </h3>
                <p className="text-gray-600 mt-1">
                  Select how you want to use our platform to {authType}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition duration-300"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {authType === "login" ? (
              // Login Modal - Minimal (Icon + Role only)
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getAvailableRoles().map((role) => {
                  const RoleIcon = role.icon;
                  return (
                    <div
                      key={role.id}
                      onClick={() => onRoleSelect(role.id)}
                      className="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition duration-300 transform hover:scale-105 text-center"
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${role.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition duration-300`}
                      >
                        <RoleIcon className="text-xl text-white" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {role.title}
                      </h4>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Signup Modal - More detailed (Icon + Role + Description)
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getAvailableRoles().map((role) => {
                  const RoleIcon = role.icon;
                  return (
                    <div
                      key={role.id}
                      onClick={() => onRoleSelect(role.id)}
                      className="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition duration-300 transform hover:scale-105 text-center flex flex-col h-full"
                    >
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${role.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300`}
                      >
                        <RoleIcon className="text-2xl text-white" />
                      </div>

                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {role.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 flex-grow">
                        {role.description}
                      </p>

                      <div
                        className={`w-full bg-gradient-to-r ${role.gradient} text-white py-2 px-4 rounded-lg font-medium text-sm group-hover:shadow-lg transition duration-300 flex items-center justify-center space-x-2 mt-auto`}
                      >
                        <RoleIcon className="text-sm" />
                        <span>Join as {role.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
