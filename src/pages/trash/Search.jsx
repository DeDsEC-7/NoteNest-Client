import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTimes } from "@fortawesome/free-solid-svg-icons";

const Search = ({ 
  showAddButton = true, 
  isArchivePage = false, 
  isTrashPage = false,
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

  const getPlaceholder = () => {
    if (isTrashPage) return "Search trashed items...";
    if (isArchivePage) return "Search archived items...";
    return "Search your items...";
  };

  const getAriaLabel = () => {
    if (isTrashPage) return "Search trashed items";
    if (isArchivePage) return "Search archived items";
    return "Search items";
  };

  const getBorderColor = () => {
    if (isTrashPage) return "border-color-error/60";
    if (isArchivePage) return "border-color-warning/60";
    return "border-accent-400/60";
  };

  const getFocusColor = () => {
    if (isTrashPage) return "focus:ring-color-error focus:border-color-error";
    if (isArchivePage) return "focus:ring-color-warning focus:border-color-warning";
    return "focus:ring-accent-600 focus:border-accent-600";
  };

  const getIconColor = () => {
    if (isTrashPage) return "text-color-error hover:text-color-error/80";
    if (isArchivePage) return "text-color-warning hover:text-color-warning/80";
    return "text-accent-600 hover:text-accent-700";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto flex items-center mb-0 bg-white/80"
    >
      <input
        type="text"
        value={localQuery}
        onChange={handleInputChange}
        placeholder={getPlaceholder()}
        className={`
          w-full px-4 py-3 pr-16 rounded-xl
          border backdrop-blur-sm
          text-typo-primary placeholder-typo-muted
          outline-none transition-all duration-200
          ${getBorderColor()} ${getFocusColor()}
        `}
        aria-label={getAriaLabel()}
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
        className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${getIconColor()}`}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
};

export default Search;