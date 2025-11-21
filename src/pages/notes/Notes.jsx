import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import Layout from "../../components/layout/Layout";
import NotesCard from "../../components/shared/NotesCard";
import NotesCardSkeleton from "../../components/shared/NotesCardSkeleton";
import Search from "./Search";
import PaginationControl from "../../components/shared/PaginationControl";
import { 
  getAllNotes, 
  editNote, 
  trashNote, 
  archiveNote, 
  unarchiveNote,
  togglePinNote
} from "../../controllers/notesController";

const Notes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [removingItems, setRemovingItems] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { user } = useSelector((state) => state.auth);
  const { notes, loading: notesLoading, pagination } = useSelector((state) => state.notes);
  const { loading: authLoading } = useSelector((state) => state.auth);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load all notes for this user with pagination
  const loadNotes = async (page = currentPage, limit = itemsPerPage) => {
    if (user?.user_id) {
      setIsRefreshing(true);
      await dispatch(getAllNotes(user.user_id, page, limit, 'updated_at', 'DESC'));
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [dispatch, user]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadNotes(newPage, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    loadNotes(1, newLimit);
  };

  // Animation handler for item removal
  const animateItemRemoval = (itemId) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    setTimeout(() => {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  // Handle delete (move to trash) with animation
  const handleDelete = (note) => {
    if (confirm("Are you sure you want to trash this note?")) {
      animateItemRemoval(note.id);
      setTimeout(() => {
        dispatch(trashNote(note.id));
      }, 250);
    }
  };

  // Handle pin/unpin note
  const handlePinNote = async (note) => {
    await dispatch(togglePinNote(note.id));
  };

  // Handle archive/unarchive with animation
  const handleArchive = (note) => {
    animateItemRemoval(note.id);
    setTimeout(() => {
      if (note.isArchived) {
        dispatch(unarchiveNote(note.id));
      } else {
        dispatch(archiveNote(note.id));
      }
    }, 250);
  };

  // Search filter function
  const filterItemsBySearch = (items, query) => {
    if (!query.trim()) return items;
    
    const lowercasedQuery = query.toLowerCase();
    return items.filter(note => 
      note.title?.toLowerCase().includes(lowercasedQuery) ||
      note.content?.toLowerCase().includes(lowercasedQuery)
    );
  };

  // Filter out trashed and archived notes for main notes view
  const filteredNotes = notes.filter(note => 
    !note.isTrash && !note.isArchived
  );

  // Apply search filter
  const searchedNotes = filterItemsBySearch(filteredNotes, debouncedQuery);

  // Sort notes: pinned first, then by update date
  const sortedNotes = [...searchedNotes].sort((a, b) => {
    // Pinned notes first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by update date (newest first)
    return new Date(b.updatedAt || b.created_at) - new Date(a.updatedAt || a.created_at);
  });

  const isLoading = notesLoading || authLoading;
  const hasNotes = sortedNotes.length > 0;
  const isSearching = debouncedQuery.trim() !== "";

  // Animation classes
  const getItemAnimationClass = (noteId) => {
    if (removingItems.has(noteId)) {
      return 'animate-slide-out-right';
    }
    return 'animate-slide-in-up';
  };

  const getContainerAnimationClass = () => {
    if (isRefreshing) return 'animate-pulse';
    return '';
  };

  return (
    <Layout>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <span className="font-bold text-primary-600 text-lg sm:text-xl">
          My Notes
        </span>
        
        <div className="flex items-center gap-3">
          {/* Pagination Info */}
          {pagination && pagination.totalItems > 0 && !isSearching && (
            <div className="text-sm text-typo-muted bg-primary-50 px-3 py-1 rounded-lg">
              {pagination.totalItems} note{pagination.totalItems !== 1 ? 's' : ''}
            </div>
          )}
          
          {/* Refresh Button with Animation */}
          <button
            onClick={() => loadNotes(currentPage, itemsPerPage)}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
              isRefreshing 
                ? 'bg-primary-100 text-primary-400 cursor-not-allowed' 
                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 hover:scale-105'
            }`}
          >
            <svg 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <Search 
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
      </div>

      {/* Search Results Info */}
      {isSearching && (
        <div className="mb-4 text-sm text-typo-muted animate-fade-in">
          {hasNotes ? (
            <p>
              Found {sortedNotes.length} note{sortedNotes.length !== 1 ? 's' : ''} for "{debouncedQuery}"
            </p>
          ) : (
            <p>
              No notes found for "{debouncedQuery}"
            </p>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className={`w-full rounded-3xl p-3 flex flex-col gap-2 max-h-94 overflow-auto transition-all duration-300 ${getContainerAnimationClass()}`}>
        {isLoading ? (
          // Show skeleton loading with animation
          <div className="animate-fade-in">
            {[...Array(itemsPerPage)].map((_, index) => (
              <NotesCardSkeleton key={index} />
            ))}
          </div>
        ) : !hasNotes ? (
          <div className="animate-bounce-in w-full">
            <div className="text-center py-8">
              <div className="text-primary-300 text-6xl mb-4">📝</div>
              <p className="text-typo-muted text-lg">
                {isSearching ? "No notes match your search" : "No notes yet..."}
              </p>
              <p className="text-typo-secondary text-sm mt-2">
                {isSearching ? "Try a different search term" : "Create your first note to get started"}
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col gap-2">
            {sortedNotes.map((note, index) => (
              <div 
                key={note.id}
                className={`transition-all duration-300 ${getItemAnimationClass(note.id)}`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <NotesCard
                  id={note.id}
                  title={note.title}
                  preview={note.content || "No content..."}
                  date={note.updatedAt || note.created_at}
                  isPinned={note.isPinned || false}
                  isArchived={note.isArchived || false}
                  onDelete={() => handleDelete(note)}
                  onArchive={() => handleArchive(note)}
                  onPin={() => handlePinNote(note)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isSearching && (
        <PaginationControl
          pagination={pagination}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          className="mt-6"
        />
      )}

    </Layout>
  );
};

export default Notes;