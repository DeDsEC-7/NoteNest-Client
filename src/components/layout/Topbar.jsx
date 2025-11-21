import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../controllers/authController";
import { useToast } from "./ToastProvider";
const Topbar = ({ setSidebarOpen }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const user = useSelector((state) => state.auth.user);
  const initials = user
    ? `${user.firstname[0].toUpperCase()}${user.lastname[0].toUpperCase()}`
    : "U";

  // Click outside dropdown to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    }

    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [moreOpen]);

  const handleLogout = () => {
    dispatch(logoutUser(navigate,addToast));
  };

  return (
    <header className="flex items-center justify-end px-4 backdrop-blur-xs border-b-4 border-double text-primary-700 border-primary-600 z-50">
      <div className="flex h-16 gap-2 items-center relative" ref={moreRef}>
        <span className="text-sm font-medium select-none whitespace-nowrap">
          Hello, {user ? user.firstname : "User"}
        </span>

        <button
          aria-label="User menu"
          onClick={() => setMoreOpen(!moreOpen)}
          className={`rounded-full transition focus:outline-none h-10 w-10 flex items-center hover:cursor-pointer justify-center
            ${moreOpen ? "bg-back-highlight " : " hover:bg-back-highlight/50 "}`}
          title="User menu"
          type="button"
        >
          {/* Display user initials */}
          <span className="font-semibold ">{initials}</span>
        </button>

        {/* Dropdown */}
        {moreOpen && (
          <div
            className="absolute top-full mt-3 right-0 backdrop-blur-sm bg-amber-50 rounded-lg border border-accent-700/30 w-44 py-2 z-50"
            role="menu"
          >
            <Link
              to="/account"
              className="flex items-center space-x-3 hover:cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-primary-700  hover:bg-back-highlight/30 mx-2"
              onClick={() => {
                setSidebarOpen(false);
                setMoreOpen(false);
              }}
              role="menuitem"
              tabIndex={0}
            >
               <FontAwesomeIcon icon={faUser} className="text-base min-w-[20px]" />
              <span>Account</span>
            </Link>
            <Link
            
              className="flex items-center space-x-3 hover:cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-primary-700  hover:bg-back-highlight/30 mx-2"
             onClick={handleLogout}
              role="menuitem"
              tabIndex={0}
            >
              <FontAwesomeIcon icon={faSignOut} className="text-base min-w-[20px]" />
              <span>Logout</span>
            </Link>
           
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
