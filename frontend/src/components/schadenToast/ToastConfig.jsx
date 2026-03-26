import { toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { FaExclamationTriangle } from "react-icons/fa";

// Toast configs
const TOAST_CONFIG = {
  default: {
    duration: 3000,
    position: "top-center",
    textColor: "white",
    classNames: {
      description: "text-white text-sm",
    },
  },

  success: {
    icon: <CheckCircle size={18} />,
    bg: "linear-gradient(90deg, #16a34a 0%, #22c55e 60%, #16a34a 100%)",
  },

  error: {
    icon: <FaExclamationTriangle size={18} />,
    bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    duration: 4000,
  },

  warning: {
    icon: <AlertTriangle size={18} />,
    bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    duration: 4000,
  },

  info: {
    icon: <Info size={18} />,
    bg: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    duration: 4000,
  },
};


// toast creator
const createToast = (type, message, options = {}) => {
  const config = TOAST_CONFIG[type] || {};

  return toast[type]?.(message, {
    description: options.description,
    icon: options.icon || config.icon,

    duration: options.duration || config.duration || TOAST_CONFIG.default.duration,
    position: options.position || TOAST_CONFIG.default.position,

    classNames: {
      ...TOAST_CONFIG.default.classNames,
      ...options.classNames,
    },

    style: {
      background: config.bg,
      color: TOAST_CONFIG.default.textColor,
      border: "none",
      ...options.style,
    },

    ...options,
  });
};


export const schadenToast = {
  success: (message, options) => createToast("success", message, options),

  error: (message, options) => createToast("error", message, options),

  warning: (message, options) => createToast("warning", message, options),

  info: (message, options) => createToast("info", message, options),

  custom: (message, options = {}) => {
    return toast(message, {
      description: options.description,
      icon: options.icon,

      duration: options.duration || TOAST_CONFIG.default.duration,
      position: options.position || TOAST_CONFIG.default.position,

      classNames: {
        ...TOAST_CONFIG.default.classNames,
        ...options.classNames,
      },

      style: {
        background: options.bg || "white",
        color: options.textColor || "#1f2937",
        border: "1px solid rgba(0,0,0,0.05)",
        ...options.style,
      },

      ...options,
    });
  },

  dismiss: () => toast.dismiss(),
};