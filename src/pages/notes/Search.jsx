import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Search = ({ onSearchChange, searchQuery, isTrashPage = false, isArchivePage = false }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchQuery || "");

  // Sync with parent component's search query
  useEffect(() => {
    setQuery(searchQuery || "");
  }, [searchQuery]);

  // Debounce input and notify parent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(query);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, onSearchChange]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log("Searching for:", query);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const getPlaceholder = () => {
    if (isTrashPage) return "Search in trash...";
    if (isArchivePage) return "Search in archive...";
    return "Search your notes...";
  };

  const getCreateLink = () => {
    if (isTrashPage || isArchivePage) return null;
    return "/notes/view";
  };

  return (
    <div className="w-full mb-6">
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-2xl mx-auto flex items-center"
      >
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={getPlaceholder()}
          className="
            w-full px-4 py-3 pr-20 rounded-xl
            border border-primary-400/60 backdrop-blur-sm
            bg-white/80 text-gray-800 placeholder-typo-muted
            focus:ring-2 focus:ring-primary-600 focus:border-primary-600
            outline-none transition-all duration-200
            shadow-sm hover:shadow-md
          "
          aria-label="Search"
        />

        {/* Search Icon */}
        <button
          type="submit"
          className="absolute right-12 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700 transition-colors duration-200 p-1"
          aria-label="Search"
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="w-4 h-4"
          />
        </button>

        {/* Create Button - Only show for notes page */}
        {getCreateLink() && (
          <Link 
            to={getCreateLink()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700 transition-all duration-200 p-1 hover:scale-110"
            aria-label="Create new note"
          >
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="w-5 h-5"
            />
          </Link>
        )}
      </form>
    </div>
  );
};

export default Search;