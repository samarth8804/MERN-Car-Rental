import { Link } from "react-router-dom";
import { roles } from "../../utils/data";

const RoleSwitcher = ({ currentRole, onRoleSwitch }) => {
  const handleRoleSwitch = (roleId) => {
    if (onRoleSwitch) {
      onRoleSwitch();
    }
  };
  return (
    <>
      {/* Role Switch */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-4">Switch role?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {roles
            .filter((r) => r.id !== "admin")
            .map((roleItem) => (
              <Link
                key={roleItem.id}
                to={`/login/${roleItem.id}`}
                onClick={() => handleRoleSwitch(roleItem.id)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  currentRole === roleItem.id
                    ? `bg-gradient-to-r ${roleItem.gradient} text-white shadow-lg`
                    : "bg-white/70 text-gray-700 hover:bg-white border border-gray-200"
                }`}
              >
                {roleItem.title}
              </Link>
            ))}
        </div>
      </div>

      {/* Admin Access */}
      {currentRole !== "admin" && (
        <div className="mt-4 text-center">
          <Link
            to="/login/admin"
            onClick={() => handleRoleSwitch("admin")}
            className="text-xs text-gray-500 hover:text-gray-700 transition duration-300"
          >
            Admin Access
          </Link>
        </div>
      )}
    </>
  );
};

export default RoleSwitcher;
