import React, { useState } from "react";
import {
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // 'default', 'approve', 'reject', 'delete'
  loading = false,
}) => {
  

  if (!isOpen) return null;

  const handleConfirm = () => {
    
      onConfirm();
    };

  const handleClose = () => {
    
    onClose();
  };

  // Get modal styling based on type
  const getModalStyle = () => {
    switch (type) {
      case "approve":
        return {
          headerBg: "bg-gradient-to-r from-green-500 to-green-600",
          confirmBg:
            "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
          icon: FaCheck,
          iconColor: "text-green-500",
        };
      case "reject":
        return {
          headerBg: "bg-gradient-to-r from-orange-500 to-orange-600",
          confirmBg:
            "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
          icon: FaExclamationTriangle,
          iconColor: "text-orange-500",
        };
      case "delete":
        return {
          headerBg: "bg-gradient-to-r from-red-500 to-red-600",
          confirmBg:
            "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
          icon: FaExclamationTriangle,
          iconColor: "text-red-500",
        };
      default:
        return {
          headerBg: "bg-gradient-to-r from-blue-500 to-blue-600",
          confirmBg:
            "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
          icon: FaCheck,
          iconColor: "text-blue-500",
        };
    }
  };

  const modalStyle = getModalStyle();
  const IconComponent = modalStyle.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
          onClick={handleClose}
        />

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal Content */}
        <div className="relative inline-block w-full max-w-md p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          {/* Header */}
          <div className={`${modalStyle.headerBg} px-6 py-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                disabled={loading}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Icon and Message */}
            <div className="flex items-start space-x-4 mb-6">
              <div
                className={`p-3 ${modalStyle.iconColor
                  .replace("text-", "bg-")
                  .replace("500", "100")} rounded-full`}
              >
                <IconComponent className={`w-6 h-6 ${modalStyle.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 leading-relaxed">{message}</p>
              </div>
            </div>

            

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
              >
                {cancelText}
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 ${modalStyle.confirmBg} text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 shadow-lg`}
              >
                {loading ? (
                  <FaSpinner className="animate-spin w-4 h-4" />
                ) : (
                  <IconComponent className="w-4 h-4" />
                )}
                <span>{confirmText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
