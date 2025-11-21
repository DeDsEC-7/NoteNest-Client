import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { 
  getAllTodos, 
  updateTodo, 
  trashTodo, 
  archiveTodo, 
  unarchiveTodo,
  togglePinTodo
} from "../../controllers/todosController";
import Layout from "../../components/layout/Layout";
import TodosCard from "../../components/shared/TodosCard";
import TodosCardSkeleton from "../../components/shared/TodosCardSkeleton";
import Search from "./Search";
import PaginationControl from "../../components/shared/PaginationControl";

const Todos = () => {
  const dispatch = useDispatch();
  const [removingItems, setRemovingItems] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { todos, loading, pagination } = useSelector((state) => state.todos);
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const userId = user?.user_id;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load todos with pagination
  const loadTodos = async (page = currentPage, limit = itemsPerPage) => {
    if (userId) {
      setIsRefreshing(true);
      await dispatch(getAllTodos(userId, page, limit, 'updated_at', 'DESC'));
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [dispatch, userId]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadTodos(newPage, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    loadTodos(1, newLimit);
  };

  // ... rest of your existing functions (animateItemRemoval, handlePinTodo, handleDelete, handleArchive, filterItemsBySearch)

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

  // Handle pin/unpin todo
  const handlePinTodo = async (todo) => {
    await dispatch(togglePinTodo(todo.id));
  };

  // Handle delete (move to trash) with animation
  const handleDelete = (todo) => {
    if (confirm("Are you sure you want to trash this todo?")) {
      animateItemRemoval(todo.id);
      setTimeout(() => {
        dispatch(trashTodo(todo.id));
      }, 250);
    }
  };

  // Handle archive/unarchive with animation
  const handleArchive = (todo) => {
    animateItemRemoval(todo.id);
    setTimeout(() => {
      if (todo.isArchived) {
        dispatch(unarchiveTodo(todo.id));
      } else {
        dispatch(archiveTodo(todo.id));
      }
    }, 250);
  };

  // Search filter function
  const filterItemsBySearch = (items, query) => {
    if (!query.trim()) return items;
    
    const lowercasedQuery = query.toLowerCase();
    return items.filter(todo => 
      todo.title?.toLowerCase().includes(lowercasedQuery) ||
      (todo.tasks && todo.tasks.some(task => 
        task.title?.toLowerCase().includes(lowercasedQuery) ||
        task.text?.toLowerCase().includes(lowercasedQuery)
      ))
    );
  };

  // Filter out trashed and archived todos for main view
  const filteredTodos = todos.filter(todo => 
    !todo.isTrash && !todo.isArchived
  );

  // Apply search filter
  const searchedTodos = filterItemsBySearch(filteredTodos, debouncedQuery);

  // Sort todos: pinned first, then by update date
  const sortedTodos = [...searchedTodos].sort((a, b) => {
    // Pinned todos first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by update date (newest first) for better UX
    return new Date(b.updatedAt || b.created_at) - new Date(a.updatedAt || a.created_at);
  });

  // Calculate stats
  const totalTasks = sortedTodos.reduce((acc, todo) => acc + (todo.tasks?.length || 0), 0);
  const completedTasks = sortedTodos.reduce((acc, todo) => 
    acc + (todo.tasks?.filter(task => task.isCompleted || task.done).length || 0), 0
  );
  const pinnedTodos = sortedTodos.filter(todo => todo.isPinned).length;

  const isLoading = loading || authLoading;
  const hasTodos = sortedTodos.length > 0;
  const isSearching = debouncedQuery.trim() !== "";

  // Animation classes
  const getItemAnimationClass = (todoId) => {
    if (removingItems.has(todoId)) {
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
        <span className="font-bold text-accent-700 text-lg sm:text-xl">
          My Todos
        </span>
        
        <div className="flex items-center gap-3">
          {/* Pagination Info */}
          {pagination && pagination.totalItems > 0 && !isSearching && (
            <div className="text-sm text-typo-muted bg-accent-50 px-3 py-1 rounded-lg">
              {pagination.totalItems} todo{pagination.totalItems !== 1 ? 's' : ''}
            </div>
          )}
          
          {/* Refresh Button with Animation */}
          <button
            onClick={() => loadTodos(currentPage, itemsPerPage)}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
              isRefreshing 
                ? 'bg-accent-100 text-accent-400 cursor-not-allowed' 
                : 'bg-accent-50 text-accent-600 hover:bg-accent-100 hover:scale-105'
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
          {hasTodos ? (
            <p>
              Found {sortedTodos.length} todo{sortedTodos.length !== 1 ? 's' : ''} for "{debouncedQuery}"
            </p>
          ) : (
            <p>
              No todos found for "{debouncedQuery}"
            </p>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className={`w-full rounded-3xl p-3 flex flex-col gap-2 max-h-94 overflow-auto transition-all duration-300 ${getContainerAnimationClass()}`}>
        {isLoading ? (
          <div className="animate-fade-in">
            {[...Array(itemsPerPage)].map((_, index) => (
              <TodosCardSkeleton key={index} />
            ))}
          </div>
        ) : !hasTodos ? (
          <div className="animate-bounce-in">
            <div className="text-center py-8">
              <div className="text-accent-300 text-6xl mb-4">✅</div>
              <p className="text-typo-muted text-lg">
                {isSearching ? "No todos match your search" : "No todos yet..."}
              </p>
              <p className="text-typo-secondary text-sm mt-2">
                {isSearching ? "Try a different search term" : "Create your first todo to get organized"}
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col gap-2">
            {sortedTodos.map((todo, index) => (
              <div 
                key={todo.id}
                className={`transition-all duration-300 ${getItemAnimationClass(todo.id)}`}
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
                  isArchived={todo.isArchived || false}
                  isTrash={todo.isTrash || false}
                  tasks={
                    todo.tasks?.map((task) => ({
                      id: task.id,
                      text: task.title || task.text,
                      done: task.isCompleted || task.done,
                      isCompleted: task.isCompleted || task.done
                    })) || []
                  }
                  onDelete={() => handleDelete(todo)}
                  onArchive={() => handleArchive(todo)}
                  onPin={() => handlePinTodo(todo)}
                  onRestore={() => {}}
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

      {/* Quick Stats with Animation */}
    </Layout>
  );
};

export default Todos;