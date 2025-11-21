import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector,useDispatch } from "react-redux";
import { setMenuExpansion } from "../../store/slices/utilSlice";
import {
  faBars,
  faAngleLeft,
  faHome,
  faUser,
  faEllipsisV,
  faNoteSticky,
  faRectangleList as faListCheck,
  faFolderOpen,
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { 
  faNoteSticky as faNoteStickyRegular,
  faHome as faHomeRegular,
  faUser as faUserRegular,
 faRectangleList as faListCheckRegular,
 faFolderOpen as faFolderOpenRegular,
 faTrashCan as faTrashCanRegular

} from "@fortawesome/free-regular-svg-icons";
import { Link, useLocation } from "react-router";

const navItems = [
  { label: "Home", icon: faHomeRegular, href: "/home" },
  { label: "Notes", icon:faNoteStickyRegular, href: "/notes" },
   { label: "Todos", icon:faListCheckRegular, href: "/todos" },
   { label: "Archive", icon:faFolderOpenRegular, href: "/archive" },
  { label: "Trash", icon:faTrashCanRegular, href: "/trash" },
  { label: "Account", icon:faUserRegular, href: "/account" },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef();
  const menuExpanded = useSelector((state) => state.utils.menuExpanded);
  const dispatch = useDispatch()

  const isActive = (href) => {
    // Exact match OR startsWith for nested routes
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
 };
 const changeIcon = (href)=>{
    switch(href){
      case "/home":
        return isActive(href)?faHome:faHomeRegular;
      case "/notes":
        return isActive(href)?faNoteSticky:faNoteStickyRegular;
          case "/todos":
        return isActive(href)?faListCheck:faListCheckRegular;
          case "/archive":
        return isActive(href)?faFolderOpen:faFolderOpenRegular;
        case "/trash":
        return isActive(href)?faTrashCan:faTrashCanRegular
      case "/account":
        return isActive(href)?faUser:faUserRegular;
      default:
        return faHomeRegular;
    }
 } 
 const location = useLocation();

  // Close mobile sidebar on window resize >= md
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
        setMoreOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  // Close More popup if clicking outside
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

  // First 3 items for bottom nav, rest in More popup
  const mainNav = navItems.slice(0, 4);
  const moreNav = navItems.slice(4);

  // Helper to check if link is active
 

  return (
    <>
     <aside
  className={`hidden md:flex flex-col overflow-x-hidden backdrop-blur-sm border-r border-red-500
  sticky top-0 h-screen transition-all duration-300 ease-in-out
  ${menuExpanded ? "w-64" : "w-16"}`}
>
  {/* Logo + Toggle */}
  <div className="flex items-center justify-between h-17 px-4 border-b-4 border-double border-primary-600">
    <div className="flex items-center gap-2 flex-grow justify-center">
      {menuExpanded && (
        <img src="/notenest.png" alt="NoteNest Logo" className="object-contain w-36" />
      )}
    </div>
    <button
      onClick={() => dispatch(setMenuExpansion(!menuExpanded))}
      className="p-2 rounded hover:bg-primary-100 text-primary-600 transition-all"
      aria-label={menuExpanded ? "Collapse sidebar" : "Expand sidebar"}
    >
      <FontAwesomeIcon icon={menuExpanded ? faAngleLeft : faBars} />
    </button>
  </div>

  {/* Navigation */}
  <nav className="flex-1 flex flex-col py-4 px-2 space-y-1 overflow-y-auto">
    {navItems.map(({ label, icon, href }) => (
      <Link
        key={label}
        to={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all
          ${
            isActive(href)
              ? "bg-primary-50 text-primary-600 font-bold"
              : "hover:bg-primary-50 text-primary-600 font-semibold"
          }`}
      >
        <FontAwesomeIcon
          icon={changeIcon(href)}
          className="text-lg min-w-[24px]"
        />
        {menuExpanded && <span>{label}</span>}
      </Link>
    ))}
  </nav>
  <div className="hidden md:flex h-10 backdrop-blur-sm border-t-4 border-double border-primary-600 items-center justify-center   z-50">
  
  </div>
</aside>

{/* Mobile Bottom Navigation */}
<nav className="fixed bottom-0 left-0 right-0 z-50 h-16 px-4 backdrop-blur-sm border-t border-primary-200 flex justify-between items-center md:hidden shadow-md">
  <div className="flex w-full max-w-md justify-between mx-auto">
    {mainNav.map(({ label, icon, href }) => (
      <Link
        key={label}
        to={href}
        className={`flex flex-col items-center text-xs transition
          ${isActive(href) ? "text-primary-600 font-bold" : "text-primary-600 hover:text-primary-700"}`}
        onClick={() => { setSidebarOpen(false); setMoreOpen(false); }}
      >
        <FontAwesomeIcon icon={changeIcon(href)} className="text-lg" />
        <span className="mt-0.5">{label}</span>
      </Link>
    ))}

    {/* More */}
    <div className="relative" ref={moreRef}>
      <button
        aria-label="More navigation"
        onClick={() => setMoreOpen(!moreOpen)}
        className={`flex flex-col items-center px-2 py-1 rounded transition
          ${moreOpen ? "bg-primary-50 text-primary-600" : "text-primary-600 hover:bg-primary-50 hover:text-primary-700"}`}
      >
        <FontAwesomeIcon icon={faEllipsisV} className="text-xl" />
        <span className="text-xs mt-0.5">More</span>
      </button>

      {moreOpen && (
        <div className="absolute bottom-16 right-0 w-40 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-primary-100 py-2 z-50">
          {moreNav.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md transition
                ${isActive(href) ? "text-primary-600 font-bold" : "text-primary-600 hover:bg-primary-50 hover:text-primary-700"}`}
              onClick={() => { setSidebarOpen(false); setMoreOpen(false); }}
            >
              <FontAwesomeIcon icon={changeIcon(href)} className="text-base min-w-[20px]" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
</nav>

    </>
  );
};

export default Sidebar;
