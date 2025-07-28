import { formatDateIndian } from "../../utils/dashboard/dateUtils";

const ProfileTab = ({ user }) => {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Profile Information
        </h2>
        <p className="text-gray-600 mt-1">Manage your account details</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
              {user?.fullname || "Not provided"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
              {user?.email || "Not provided"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
              {user?.phone || "Not provided"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
              {user?.address || "Not provided"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Customer
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
              {user?.createdAt
                ? formatDateIndian(user.createdAt)
                : "Not available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
