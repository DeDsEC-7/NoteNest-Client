import { useState, useRef, useEffect } from "react";

const Dropdown = ({ trigger, items = [], className = "w-48" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Trigger element */}
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger({ open })}
      </div>

      {/* Dropdown menu */}
      {open && (
        <div
          className={`absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 ${className}`}
        >
          {items.map((item, idx) => {
            if (item.type === "button") {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setOpen(false);
                    item.onClick?.();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  type="button"
                >
                  {item.icon && <item.icon className="min-w-[18px]" />}
                  <span>{item.label}</span>
                </button>
              );
            } else if (item.type === "link") {
              return (
                <a
                  key={idx}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  {item.icon && <item.icon className="min-w-[18px]" />}
                  <span>{item.label}</span>
                </a>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
