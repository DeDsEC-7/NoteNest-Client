import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import Layout from "../../components/layout/Layout";
import Search from "../../components/shared/Search";
import PinnedGrid from "./components/PinnedGrid";
import CardList from "./components/CardsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { 
  getHomeData, 
  searchItems, 
  togglePinHomeItem,
  trashHomeItem,
  archiveHomeItem 
} from "../../controllers/homeController";
import NotesCardSkeleton from "../../components/shared/NotesCardSkeleton";
import TodosCardSkeleton from "../../components/shared/TodosCardSkeleton";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchType, setSearchType] = useState("all");

  // Get data from Redux store
  const { 
    pinnedItems, 
    homeItems, 
    searchResults,
    homePagination,
    loading 
  } = useSelector((state) => state.home);

  const { user } = useSelector((state) => state.auth);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load home data
  useEffect(() => {
    if (user?.user_id) {
      if (debouncedQuery.trim()) {
        // If there's a search query, perform search
      
        dispatch(searchItems(
          user.user_id,      // userId
          debouncedQuery,    // keyword
          'all',             // type (always 'all' now)
          'active',          // category
          currentPage,       // page
          itemsPerPage       // limit
        ));
      } else {
        // Otherwise load regular home data

        dispatch(getHomeData(
          user.user_id,      // userId
          currentPage,       // page
          itemsPerPage,      // limit
          'all',             // type
          ''                 // keyword
        ));
      }
    }
  }, [dispatch, user, debouncedQuery, searchType, currentPage, itemsPerPage]);

  // Handle search from Search component
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle filter change from Search component
  const handleFilterChange = (filter) => {
   
    const filterMap = {
      'All': 'all',
      'Notes': 'notes', 
      'Todos': 'todos'
    };
    setSearchType(filterMap[filter] || 'all');
    setCurrentPage(1);
  };

  // Handle pin toggle
  const handlePinToggle = (itemId, itemType) => {

    dispatch(togglePinHomeItem(itemId, itemType));
  };

  // Handle trash
  const handleTrash = (itemId, itemType) => {
    if (confirm(`Are you sure you want to move this ${itemType} to trash?`)) {
     
      dispatch(trashHomeItem(itemId, itemType));
    }
  };

  // Handle archive
  const handleArchive = (itemId, itemType) => {
   
    dispatch(archiveHomeItem(itemId, itemType));
  };

  // Check if we're showing search results
  const isSearching = debouncedQuery.trim() !== "";
  const showingItems = isSearching ? searchResults : homeItems;
  const hasItems = showingItems.notes?.length > 0 || showingItems.todos?.length > 0;

 

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        {/* Header */}
        <div className="w-full flex flex-col gap-4">
          <span className="self-start font-bold text-primary-600 text-lg sm:text-xl">
            My Dashboard
          </span>
          
          {/* Pinned Section */}
          {(pinnedItems.notes?.length > 0 || pinnedItems.todos?.length > 0) && (
            <div className="w-full">
              <h2 className="text-md font-semibold text-typo-secondary mb-2">
                Pinned Items
              </h2>
              <PinnedGrid 
                pinnedItems={pinnedItems}
                onPinToggle={handlePinToggle}
                onTrash={handleTrash}
                onArchive={handleArchive}
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 w-full gap-4">
            <Link to={"/notes/view"}>
              <div className="flex flex-col items-center justify-center transition-all font-bold text-primary-600/70 hover:text-primary-600 ease-in-out duration-300 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg cursor-pointer border border-primary-200 bg-primary-100/50 h-24">
                <FontAwesomeIcon icon={faPlus} className="md:text-2xl text-lg"/>
                <h1 className="text-sm md:text-md">New Note</h1>
              </div>
            </Link>
            <Link to={"/todos/view"}>
              <div className="flex flex-col items-center justify-center transition-all font-bold text-accent-600/70 hover:text-accent-600 ease-in-out duration-300 rounded-2xl shadow-sm hover:shadow-lg border cursor-pointer backdrop-blur-sm h-24 bg-accent-300/20 border-accent-400/60">
                <FontAwesomeIcon icon={faPlus} className="md:text-2xl text-lg"/>
                <h1 className="text-sm md:text-md">New Todo</h1>
              </div>
            </Link>
          </div>

          {/* Search */}
          <Search 
            onSearchChange={handleSearch}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
          />

          {/* Search Results Info */}
          {isSearching && (
            <div className="w-full text-sm text-typo-muted animate-fade-in">
              {loading ? (
                <p>Searching...</p>
              ) : hasItems ? (
                <p>
                  Found {(showingItems.notes?.length || 0) + (showingItems.todos?.length || 0) + " "} 
                  result {((showingItems.notes?.length || 0) + (showingItems.todos?.length || 0)) !== 1 ? 's' : ''} 
                  for "{debouncedQuery}"
                </p>
              ) : (
                <p>No results found for "{debouncedQuery}"</p>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="w-full p-2 flex flex-col gap-2">
            <NotesCardSkeleton count={2} />
            <TodosCardSkeleton count={2} />
          </div>
        ) : hasItems ? (
          <CardList 
            items={showingItems}
            onPinToggle={handlePinToggle}
            onTrash={handleTrash}
            onArchive={handleArchive}
            isSearchResults={isSearching}
          />
        ) : (
          <div className="text-center py-8 animate-fade-in">
            <div className="text-primary-300 text-6xl mb-4">📝</div>
            <p className="text-typo-muted text-lg">
              {isSearching ? "No items match your search" : "No items yet..."}
            </p>
            <p className="text-typo-secondary text-sm mt-2">
              {isSearching ? "Try a different search term" : "Create your first note or todo to get started"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;