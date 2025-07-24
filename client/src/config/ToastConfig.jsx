import { Toaster } from "react-hot-toast";

// ✨ Enhanced Toast Configuration for easyGo - UI Only
export const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerClassName="toast-container"
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        // ✨ Base toast styling
        className: "toast-base",
        duration: 4000,
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#ffffff",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          padding: "16px 20px",
          minWidth: "300px",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        },

        // ✨ Success toast styling (Green gradient)
        success: {
          duration: 3500,
          style: {
            background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
            color: "#ffffff",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 10px 25px -5px rgba(34, 197, 94, 0.3), 0 8px 10px -6px rgba(34, 197, 94, 0.2)",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#22c55e",
          },
        },

        // ✨ Error toast styling (Red gradient)
        error: {
          duration: 4500,
          style: {
            background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
            color: "#ffffff",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 10px 25px -5px rgba(239, 68, 68, 0.3), 0 8px 10px -6px rgba(239, 68, 68, 0.2)",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#ef4444",
          },
        },

        // ✨ Loading toast styling (Blue gradient - matching your website)
        loading: {
          duration: Infinity,
          style: {
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            color: "#ffffff",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.2)",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#3b82f6",
          },
        },

        // ✨ Warning toast styling (Amber gradient)
        warning: {
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            color: "#ffffff",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 10px 25px -5px rgba(245, 158, 11, 0.3), 0 8px 10px -6px rgba(245, 158, 11, 0.2)",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#f59e0b",
          },
        },

        // ✨ Info toast styling (Cyan gradient)
        info: {
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            color: "#ffffff",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 10px 25px -5px rgba(8, 145, 178, 0.3), 0 8px 10px -6px rgba(8, 145, 178, 0.2)",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#0891b2",
          },
        },
      }}
    />
  );
};

// ✨ Export default toast options for custom styling
export const defaultToastOptions = {
  duration: 4000,
  style: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    padding: "16px 20px",
    minWidth: "300px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

// ✨ Toast style variants for different contexts
export const toastStyles = {
  easyGo: {
    style: {
      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      color: "#ffffff",
      borderRadius: "16px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
      boxShadow:
        "0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.2)",
    },
  },
  minimal: {
    style: {
      background: "#ffffff",
      color: "#374151",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  },
  dark: {
    style: {
      background: "#1f2937",
      color: "#ffffff",
      border: "1px solid #374151",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
    },
  },
};
