import { useState, useMemo } from "react";
import { useLocation } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import FloatingCart from "./FloatingCart";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Memoize background style to prevent unnecessary recalculations on each render
  const backgroundStyle = useMemo(() => ({
    backgroundImage: `repeating-linear-gradient(
      45deg,
      rgba(122, 88, 58, 0.03),
      rgba(122, 88, 58, 0.03) 0.5px,
      transparent 0.5px,
      transparent 4px
    )`,
  }), []);

  return (
    <div className="h-screen flex  text-[#5E4B3C]  bg-paper overflow-x-hidden custom-scrollbar font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col  overflow-hidden">
        <Topbar setSidebarOpen={setSidebarOpen} />
        
        <main
          
          className="flex-1 p-4  overflow-auto mb-14 sm:mb-0"
        >
          {children || (
            <div className="text-center text-primary-600 font-medium opacity-50">
              Your content goes here.
            </div>
          )}
        </main>

        {/* Render FloatingCart only if not on cart page */}
        
        <div className="hidden md:flex h-10 backdrop-blur-sm border-t-4 border-double border-primary-600 items-center justify-center   z-50">
            <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
