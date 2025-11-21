import { createContext, useContext, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faCartPlus,
} from "@fortawesome/free-solid-svg-icons";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info") => {
      const id = toastId++;
      setToasts((current) => [...current, { id, message, type }]);
      setTimeout(() => removeToast(id), 2000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Mobile: Top Right - Smaller */}
      <div className="fixed top-2 right-2 flex flex-col space-y-2 w-full max-w-[280px] z-50 md:hidden">
        {toasts.map(({ id, message, type }) => (
          <Toast key={id} type={type} onClose={() => removeToast(id)} mobile={true}>
            {message}
          </Toast>
        ))}
      </div>
      
      {/* Desktop/Larger screens: Bottom Left - Normal size */}
      <div className="fixed bottom-2 left-2 flex flex-col space-y-2 w-full max-w-xs z-50 hidden md:flex">
        {toasts.map(({ id, message, type }) => (
          <Toast key={id} type={type} onClose={() => removeToast(id)} mobile={false}>
            {message}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ children, type, onClose, mobile = false }) => {
  const iconMap = {
    success: faCheckCircle,
    error: faTimesCircle,
    info: faInfoCircle,
    added: faCartPlus,
  };
  const icon = iconMap[type] || faInfoCircle;

  const bgColorMap = {
    success: "var(--color-success)",
    error: "var(--color-error)",
    info: "var(--color-primary-600)",
    added: "var(--color-accent-600)",
  };
  const bgColor = bgColorMap[type] || "var(--color-primary-600)";

  const textColorMap = {
    success: "var(--color-typo-inverse)",
    error: "var(--color-typo-inverse)",
    info: "var(--color-typo-inverse)",
    added: "var(--color-typo-inverse)",
  };
  const textColor = textColorMap[type] || "var(--color-typo-inverse)";

  return (
    <div
      className={`rounded-md shadow-lg cursor-pointer w-full flex items-center space-x-2 animate-fadeInDown ${
        mobile 
          ? "px-3 py-2 text-xs max-w-[280px]"  // Smaller on mobile
          : "px-4 py-3 text-sm max-w-xs"       // Normal on desktop
      }`}
      style={{ backgroundColor: bgColor, color: textColor }}
      onClick={onClose}
      role="alert"
      aria-live="assertive"
    >
      <FontAwesomeIcon 
        icon={icon} 
        className={mobile ? "text-xs" : "text-sm"} 
      />
      <span className="flex-1">{children}</span>
    </div>
  );
};