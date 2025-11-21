import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTimes } from "@fortawesome/free-solid-svg-icons";

const Search = ({ 
  showAddButton = true, 
  isArchivePage = false, 
  onSearchChange,
  searchQuery = ""
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Sync local state with parent state
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    onSearchChange(value);
  };

  const handleClearSearch = () => {
    setLocalQuery("");
    onSearchChange("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Search is handled automatically via the debounced query
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto flex items-center mb-5 bg-white/80"
    >
      <input
        type="text"
        value={localQuery}
        onChange={handleInputChange}
        placeholder={isArchivePage ? "Search archived items..." : "Search your items..."}
        className="
          w-full px-4 py-3 pr-16 rounded-xl
          border border-color-warning/60 backdrop-blur-sm
          text-typo-primary placeholder-typo-muted
          focus:ring-2 focus:ring-color-warning focus:border-color-warning
          outline-none transition-all duration-200
        "
        aria-label={isArchivePage ? "Search archived items" : "Search items"}
      />

      {/* Clear Button - Show when there's text */}
      {localQuery && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute right-10 top-1/2 -translate-y-1/2 text-typo-muted hover:text-typo-primary transition"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}

      {/* Search Icon */}
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-color-warning hover:text-color-warning/80 transition"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
};

export default Search;