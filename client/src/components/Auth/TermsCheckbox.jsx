import { useState } from "react";
import { createPortal } from "react-dom";
import { FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import TermsAndPrivacyDialog from "./TermsAndPrivacyDialog";

const TermsCheckbox = ({ checked, onChange, error, disabled = false }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("terms");

  const openDialog = (type, e) => {
    e.preventDefault(); // Prevent form submission
    setDialogType(type);
    setDialogOpen(true);
  };


  return (
    <>
      <div className="space-y-3">
        {/* Terms and Conditions Checkbox */}
        <div className="flex items-start space-x-3">
          <div className="flex items-center pt-1">
            <button
              type="button"
              onClick={() => {
                
                onChange(!checked);
              }}
              disabled={disabled}
              className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all duration-200 ${
                checked
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "border-gray-300 hover:border-blue-400 bg-white"
              } ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-sm"
              } ${error ? "border-red-300" : ""}`}
            >
              {checked && <FaCheck size={10} />}
            </button>
          </div>

          <div className="text-sm text-gray-600 leading-relaxed flex-1">
            <span>I agree to the </span>
            <button
              type="button"
              onClick={(e) => openDialog("terms", e)}
              className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors inline-flex items-center gap-1 hover:gap-2"
              disabled={disabled}
            >
              Terms and Conditions
              <FaExternalLinkAlt size={10} className="opacity-70" />
            </button>
            <span> and </span>
            <button
              type="button"
              onClick={(e) => openDialog("privacy", e)}
              className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors inline-flex items-center gap-1 hover:gap-2"
              disabled={disabled}
            >
              Privacy Policy
              <FaExternalLinkAlt size={10} className="opacity-70" />
            </button>
          </div>
        </div>

        {/* ✅ Enhanced Error Message Display */}
        {error && (
          <div className="ml-8">
            <p className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-lg border border-red-200">
              <span className="w-4 h-4 mr-2">⚠️</span>
              <strong>{error}</strong>
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="ml-8">
          <p className="text-xs text-gray-500">
            By creating an account, you acknowledge that you have read and
            understood our terms and privacy policy.
          </p>
        </div>
      </div>

      {/* ✅ Render dialog using portal to document.body for full viewport positioning */}
      {dialogOpen &&
        createPortal(
          <TermsAndPrivacyDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            type={dialogType}
          />,
          document.body // ✅ Render at body level, not inside form
        )}
    </>
  );
};

export default TermsCheckbox;
