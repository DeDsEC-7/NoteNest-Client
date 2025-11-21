import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Search = ({ onSearchChange, searchQuery = "" }) => {
  const [query, setQuery] = useState(searchQuery);

  // Sync with parent component's search query
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearchChange(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearchChange(query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-2xl mx-auto bg-white/80 rounded-xl border border-accent-400/60 backdrop-blur-sm"
    >
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search your notes and todos..."
        className="w-full px-4 py-3 pr-12 bg-transparent text-gray-800 placeholder-typo-muted focus:outline-none rounded-xl"
        aria-label="Search notes and todos"
      />

      {/* Search Icon */}
      <button 
        type="submit" 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-600 hover:text-accent-700 transition"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
};

export default Search;