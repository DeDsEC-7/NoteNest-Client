import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { 
  getTrashedTodos, 
  updateTodo, 
  deleteTodo, 
  restoreTodo 
} from "../../controllers/todosController";
import { 
  getTrashedNotes, 
  editNote, 
  deleteNote, 
  restoreNote 
} from "../../controllers/notesController";
import Layout from "../../components/layout/Layout";
import TodosCard from "../../components/shared/TodosCard";
import NotesCard from "../../components/shared/NotesCard";
import TodosCardSkeleton from "../../components/shared/TodosCardSkeleton";
import NotesCardSkeleton from "../../components/shared/NotesCardSkeleton";
import Search from "./Search";

const Trash = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [removingItems, setRemovingItems] = useState(new Set()); // Track items being removed
  const [isRefreshing, setIsRefreshing] = useState(false); // Track refresh state
  const [isEmptying, setIsEmptying] = useState(false); // Track empty trash animation
  
  // Get data from both slices
  const { trashedTodos, loading: todosLoading } = useSelector((state) => state.todos);
  const { trashedNotes, loading: notesLoading } = useSelector((state) => state.notes);
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const userId = user?.user_id;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load trashed items
  const loadTrashedItems = async () => {
    if (userId) {
      setIsRefreshing(true);
      await Promise.all([
        dispatch(getTrashedTodos(userId)),
        dispatch(getTrashedNotes(userId))
      ]);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTrashedItems();
  }, [dispatch, userId]);

  // Animation handler for item removal
  const animateItemRemoval = (itemId, type) => {
    const itemKey = `${type}-${itemId}`;
    setRemovingItems(prev => new Set(prev).add(itemKey));
    
    // Remove from animation set after animation completes
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
    if (confirm("Are you sure you want to permanently delete this todo? This action cannot be undone.")) {
      animateItemRemoval(todo.id, 'todo');
      setTimeout(async () => {
        try {
          await dispatch(deleteTodo(todo.id));
          loadTrashedItems();
        } catch (error) {
          console.error("Error deleting todo:", error);
        }
      }, 250);
    }
  };

  const handleRestoreTodo = async (todo) => {
    animateItemRemoval(todo.id, 'todo');
    setTimeout(async () => {
      try {
        await dispatch(restoreTodo(todo.id));
        loadTrashedItems();
      } catch (error) {
        console.error("Error restoring todo:", error);
      }
    }, 250);
  };

  // Note handlers with animations
  const handlePinNote = async (note) => {
    await dispatch(editNote(note.id, { isPinned: !note.isPinned }));
  };

  const handleDeleteNote = async (note) => {
    if (confirm("Are you sure you want to permanently delete this note? This action cannot be undone.")) {
      animateItemRemoval(note.id, 'note');
      setTimeout(async () => {
        try {
          await dispatch(deleteNote(note.id));
          loadTrashedItems();
        } catch (error) {
          console.error("Error deleting note:", error);
        }
      }, 250);
    }
  };

  const handleRestoreNote = async (note) => {
    animateItemRemoval(note.id, 'note');
    setTimeout(async () => {
      try {
        await dispatch(restoreNote(note.id));
        loadTrashedItems();
      } catch (error) {
        console.error("Error restoring note:", error);
      }
    }, 250);
  };

  // Empty trash functionality with animation
  const handleEmptyTrash = async () => {
    if (confirm("Are you sure you want to empty the trash? This will permanently delete all items and cannot be undone.")) {
      setIsEmptying(true);
      
      // Animate all items removal
      const allItems = [
        ...trashedTodos.map(todo => `todo-${todo.id}`),
        ...trashedNotes.map(note => `note-${note.id}`)
      ];
      setRemovingItems(new Set(allItems));
      
      setTimeout(async () => {
        try {
          // Delete all trashed todos
          const todoPromises = trashedTodos.map(todo => 
            dispatch(deleteTodo(todo.id)).unwrap()
          );
          
          // Delete all trashed notes
          const notePromises = trashedNotes.map(note => 
            dispatch(deleteNote(note.id)).unwrap()
          );
          
          // Wait for all deletions to complete
          await Promise.all([...todoPromises, ...notePromises]);
          
          // Refresh the trashed list
          loadTrashedItems();
          
          // Reset emptying state
          setIsEmptying(false);
          setRemovingItems(new Set());
          
        } catch (error) {
          console.error("Error emptying trash:", error);
          setIsEmptying(false);
          setRemovingItems(new Set());
        }
      }, 500);
    }
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
  const filteredTodos = filterItemsBySearch(trashedTodos, debouncedQuery);
  const filteredNotes = filterItemsBySearch(trashedNotes, debouncedQuery);
  
  const sortedTodos = sortByPinnedAndDate(filteredTodos);
  const sortedNotes = sortByPinnedAndDate(filteredNotes);

  const isLoading = todosLoading || notesLoading || authLoading;
  const hasTrashedItems = trashedTodos.length > 0 || trashedNotes.length > 0;
  const hasSearchResults = sortedTodos.length > 0 || sortedNotes.length > 0;
  const isSearching = debouncedQuery.trim() !== "";

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
    if (isEmptying) return 'animate-shake';
    return '';
  };

  if (isLoading) {
    return (
      <Layout>
        <span className="self-start font-bold text-color-error text-lg sm:text-xl mb-4">
          Trash
        </span>
        <Search 
          isTrashPage={true} 
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
        <div className=" w-full rounded-3xl p-3 flex flex-col gap-2 max-h-94 overflow-auto">
          {/* Show skeleton cards for both todos and notes */}
          <TodosCardSkeleton count={2} />
          <NotesCardSkeleton count={2} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-color-error text-lg sm:text-xl">
          Trash
        </span>
        
        {/* Refresh Button with Animation */}
        <button
          onClick={loadTrashedItems}
          disabled={isRefreshing}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
            isRefreshing 
              ? 'bg-color-error/20 text-color-error/60 cursor-not-allowed' 
              : 'bg-color-error/10 text-color-error hover:bg-color-error/20 hover:scale-105'
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

      <Search 
        isTrashPage={true} 
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* Search Results Info with Animation */}
      {isSearching && (
        <div className="mb-4 text-sm text-typo-muted animate-fade-in">
          {hasSearchResults ? (
            <p>
              Found {sortedTodos.length + sortedNotes.length} result{sortedTodos.length + sortedNotes.length !== 1 ? 's' : ''} for "{debouncedQuery}"
            </p>
          ) : (
            <p>
              No results found for "{debouncedQuery}"
            </p>
          )}
        </div>
      )}

      {/* Empty Trash Button with Animation */}
      {hasTrashedItems && (
        <div className="flex justify-end ">
          <button
            onClick={handleEmptyTrash}
            disabled={isEmptying}
            className={`flex items-center gap-2 px-4 py-2 bg-color-error text-white rounded-lg transition-all duration-200 text-sm ${
              isEmptying 
                ? 'animate-pulse cursor-not-allowed opacity-80' 
                : 'hover:bg-color-error/80 hover:scale-105'
            }`}
          >
            {isEmptying ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Emptying...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Empty Trash
              </>
            )}
          </button>
        </div>
      )}

      <div className={`mt-0 w-full rounded-3xl p-3 flex flex-col gap-2 max-h-94 overflow-auto transition-all duration-300 ${getContainerAnimationClass()}`}>
        {!hasTrashedItems ? (
          <div className="animate-bounce-in">
            <div className="text-center py-8">
              <div className="text-color-error/40 text-6xl mb-4">🗑️</div>
              <p className="text-typo-muted text-lg">Trash is empty</p>
              <p className="text-typo-secondary text-sm mt-2">
                Deleted items will appear here
              </p>
            </div>
          </div>
        ) : !hasSearchResults && isSearching ? (
          <div className="animate-fade-in-up">
            <p className="text-typo-secondary text-center py-3">
              No trashed items match your search
            </p>
          </div>
        ) : (
          <div>
            {/* Trashed Todos with Animations */}
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
                  isArchived={todo.isArchived || false}
                  isTrash={true}
                  tasks={
                    todo.tasks?.map((task) => ({
                      id: task.id,
                      text: task.title || task.text,
                      done: task.isCompleted || task.done,
                      isCompleted: task.isCompleted || task.done
                    })) || []
                  }
                  onDelete={() => handleDeleteTodo(todo)}
                  onArchive={() => {}} // Not used in trash
                  onPin={() => handlePinTodo(todo)}
                  onRestore={() => handleRestoreTodo(todo)}
                />
              </div>
            ))}

            {/* Trashed Notes with Animations */}
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
                  isArchived={note.isArchived || false}
                  isTrash={true}
                  onDelete={() => handleDeleteNote(note)}
                  onArchive={() => {}} // Not used in trash
                  onPin={() => handlePinNote(note)}
                  onRestore={() => handleRestoreNote(note)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Message with Animation */}
      {hasTrashedItems && (
        <div className="mt-4 text-center animate-fade-in">
          <p className="text-typo-muted text-sm">
            Items in trash will be automatically deleted after 30 days
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Trash;