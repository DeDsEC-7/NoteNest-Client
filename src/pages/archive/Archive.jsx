import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { 
  getArchivedTodos, 
  updateTodo, 
  trashTodo, 
  unarchiveTodo 
} from "../../controllers/todosController";
import { 
  getArchivedNotes, 
  editNote, 
  trashNote, 
  unarchiveNote 
} from "../../controllers/notesController";
import Layout from "../../components/layout/Layout";
import TodosCard from "../../components/shared/TodosCard";
import NotesCard from "../../components/shared/NotesCard";
import TodosCardSkeleton from "../../components/shared/TodosCardSkeleton";
import NotesCardSkeleton from "../../components/shared/NotesCardSkeleton";
import Search from "./Search";
import PaginationControl from "../../components/shared/PaginationControl";

const Archive = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [removingItems, setRemovingItems] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Get data from both slices - ADDED MISSING SELECTORS
  const { 
    archivedTodos, 
    loading: todosLoading, 
    archivedPagination: todosPagination 
  } = useSelector((state) => state.todos);

  const { 
    archivedNotes, 
    loading: notesLoading, 
    archivedPagination: notesPagination 
  } = useSelector((state) => state.notes);

  const { loading: authLoading } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const userId = user?.user_id;

  // Create a combined pagination object
  const getCombinedPagination = () => {
    // If we have todos pagination, use it (since both should be similar)
    if (todosPagination && todosPagination.totalItems > 0) {
      return todosPagination;
    }
    // Otherwise use notes pagination
    if (notesPagination && notesPagination.totalItems > 0) {
      return notesPagination;
    }
    // Return null if no pagination data
    return null;
  };

  const pagination = getCombinedPagination();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load archived items with pagination
  const loadArchivedItems = async (page = currentPage, limit = itemsPerPage) => {
    if (userId) {
      setIsRefreshing(true);
      await Promise.all([
        dispatch(getArchivedTodos(userId, page, limit, 'updated_at', 'DESC')),
        dispatch(getArchivedNotes(userId, page, limit, 'updated_at', 'DESC'))
      ]);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadArchivedItems();
  }, [dispatch, userId]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadArchivedItems(newPage, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    loadArchivedItems(1, newLimit);
  };

  // Animation handler for item removal
  const animateItemRemoval = (itemId, type) => {
    const itemKey = `${type}-${itemId}`;
    setRemovingItems(prev => new Set(prev).add(itemKey));
    
    setTimeout(() => {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }, 300);
  };

  // Todo handlers with animations
  const handlePinTodo = async (todo) => {
    await dispatch(updateTodo(todo.id, { isPinned: !todo.isPinned }));
  };

  const handleDeleteTodo = async (todo) => {
    if (confirm("Are you sure you want to trash this archived todo?")) {
      animateItemRemoval(todo.id, 'todo');
      setTimeout(async () => {
        await dispatch(trashTodo(todo.id));
        loadArchivedItems(currentPage, itemsPerPage);
      }, 250);
    }
  };

  const handleUnarchiveTodo = async (todo) => {
    animateItemRemoval(todo.id, 'todo');
    setTimeout(async () => {
      await dispatch(unarchiveTodo(todo.id));
      loadArchivedItems(currentPage, itemsPerPage);
    }, 250);
  };

  // Note handlers with animations
  const handlePinNote = async (note) => {
    await dispatch(editNote(note.id, { isPinned: !note.isPinned }));
  };

  const handleDeleteNote = async (note) => {
    if (confirm("Are you sure you want to trash this archived note?")) {
      animateItemRemoval(note.id, 'note');
      setTimeout(async () => {
        await dispatch(trashNote(note.id));
        loadArchivedItems(currentPage, itemsPerPage);
      }, 250);
    }
  };

  const handleUnarchiveNote = async (note) => {
    animateItemRemoval(note.id, 'note');
    setTimeout(async () => {
      await dispatch(unarchiveNote(note.id));
      loadArchivedItems(currentPage, itemsPerPage);
    }, 250);
  };

  // Search filter function
  const filterItemsBySearch = (items, query) => {
    if (!query.trim()) return items;
    
    const lowercasedQuery = query.toLowerCase();
    return items.filter(item => 
      item.title?.toLowerCase().includes(lowercasedQuery) ||
      item.content?.toLowerCase().includes(lowercasedQuery) ||
      (item.tasks && item.tasks.some(task => 
        task.title?.toLowerCase().includes(lowercasedQuery) ||
        task.text?.toLowerCase().includes(lowercasedQuery)
      ))
    );
  };

  // Sort functions
  const sortByPinnedAndDate = (items) => {
    return [...items].sort((a, b) => {
      // Pinned items first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then sort by update date (newest first)
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });
  };

  // Apply search filter and sorting
  const filteredTodos = filterItemsBySearch(archivedTodos, debouncedQuery);
  const filteredNotes = filterItemsBySearch(archivedNotes, debouncedQuery);
  
  const sortedTodos = sortByPinnedAndDate(filteredTodos);
  const sortedNotes = sortByPinnedAndDate(filteredNotes);

  const isLoading = todosLoading || notesLoading || authLoading;
  const hasArchivedItems = archivedTodos.length > 0 || archivedNotes.length > 0;
  const hasSearchResults = sortedTodos.length > 0 || sortedNotes.length > 0;
  const isSearching = debouncedQuery.trim() !== "";

  // Combined items count for search results
  const totalSearchResults = sortedTodos.length + sortedNotes.length;
  const totalArchivedItems = (todosPagination?.totalItems || 0) + (notesPagination?.totalItems || 0);

  // Animation classes
  const getItemAnimationClass = (itemId, type) => {
    const itemKey = `${type}-${itemId}`;
    if (removingItems.has(itemKey)) {
      return 'animate-slide-out-right';
    }
    return 'animate-slide-in-up';
  };

  const getContainerAnimationClass = () => {
    if (isRefreshing) return 'animate-pulse';
    return '';
  };

  if (isLoading) {
    return (
      <Layout>
        <span className="self-start font-bold text-color-warning text-lg sm:text-xl mb-4">
          Archived Items
        </span>
        <Search 
          isArchivePage={true} 
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
        <div className="w-full rounded-3xl p-3 flex flex-col gap-2 max-h-94 overflow-auto">
          <TodosCardSkeleton count={2} />
          <NotesCardSkeleton count={2} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <span className="font-bold text-color-warning text-lg sm:text-xl">
          Archived Items
        </span>
        
        <div className="flex items-center gap-3">
          {/* Pagination Info */}
          {pagination && totalArchivedItems > 0 && !isSearching && (
            <div className="text-sm text-typo-muted bg-color-warning/10 px-3 py-1 rounded-lg">
              {totalArchivedItems} archived item{totalArchivedItems !== 1 ? 's' : ''}
            </div>
          )}
          
          {/* Refresh Button with Animation */}
          <button
            onClick={() => loadArchivedItems(currentPage, itemsPerPage)}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
              isRefreshing 
                ? 'bg-color-warning/20 text-color-warning/60 cursor-not-allowed' 
                : 'bg-color-warning/10 text-color-warning hover:bg-color-warning/20 hover:scale-105'
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
          isArchivePage={true} 
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
      </div>

      {/* Search Results Info */}
      {isSearching && (
        <div className="mb-4 text-sm text-typo-muted animate-fade-in">
          {hasSearchResults ? (
            <p>
              Found {totalSearchResults} result{totalSearchResults !== 1 ? 's' : ''} for "{debouncedQuery}"
            </p>
          ) : (
            <p>
              No results found for "{debouncedQuery}"
            </p>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className={`w-full rounded-3xl p-3 flex flex-col gap-2 max-h-94 overflow-auto transition-all duration-300 ${getContainerAnimationClass()}`}>
        {!hasArchivedItems ? (
          <></>
        ) : !hasSearchResults && isSearching ? (
          <div className="animate-fade-in-up">
            <p className="text-typo-secondary text-center py-3">
              No archived items match your search
            </p>
          </div>
        ) : (
          <div>
            {/* Archived Todos with Animations */}
            {sortedTodos.map((todo, index) => (
              <div 
                key={`todo-${todo.id}`}
                className={`transition-all duration-300 mb-2 ${getItemAnimationClass(todo.id, 'todo')}`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <TodosCard
                  id={todo.id}
                  title={todo.title}
                  due={todo.due_date || todo.dueDate || "No due date"}
                  isPinned={todo.isPinned || false}
                  isArchived={true}
                  isTrash={false}
                  tasks={
                    todo.tasks?.map((task) => ({
                      id: task.id,
                      text: task.title || task.text,
                      done: task.isCompleted || task.done,
                      isCompleted: task.isCompleted || task.done
                    })) || []
                  }
                  onDelete={() => handleDeleteTodo(todo)}
                  onArchive={() => handleUnarchiveTodo(todo)}
                  onPin={() => handlePinTodo(todo)}
                  onRestore={() => {}}
                />
              </div>
            ))}

            {/* Archived Notes with Animations */}
            {sortedNotes.map((note, index) => (
              <div 
                key={`note-${note.id}`}
                className={`transition-all duration-300 mb-2 ${getItemAnimationClass(note.id, 'note')}`}
                style={{
                  animationDelay: `${(sortedTodos.length + index) * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <NotesCard
                  id={note.id}
                  title={note.title}
                  preview={note.content || "No content..."}
                  date={note.updatedAt}
                  isPinned={note.isPinned || false}
                  isArchived={true}
                  isTrash={false}
                  onDelete={() => handleDeleteNote(note)}
                  onArchive={() => handleUnarchiveNote(note)}
                  onPin={() => handlePinNote(note)}
                  onRestore={() => {}}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls - Only show when not searching */}
      {!isSearching && pagination && pagination.totalItems > 0 && (
        <PaginationControl
          pagination={pagination}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          className="mt-6"
        />
      )}

      {/* Empty state animation */}
      {!hasArchivedItems && !isLoading && (
        <div className="animate-bounce-in text-center mt-8">
          <div className="text-color-warning/40 text-6xl mb-4">📁</div>
          <p className="text-typo-muted text-lg">Your archive is empty</p>
          <p className="text-typo-secondary text-sm mt-2">
            Items you archive will appear here
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Archive;