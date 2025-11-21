import { useMemo } from "react";

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="text-center text-sm  select-none text-accent-700
                 "
    >
      &copy; {currentYear} NoteNest. All rights reserved.
    </footer>
  );
};

export default Footer;
