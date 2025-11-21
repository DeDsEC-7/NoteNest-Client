import { createSlice } from "@reduxjs/toolkit";

const homeSlice = createSlice({
  name: "home",
  initialState: {
    // Pinned items
    pinnedItems: {
      notes: [],
      todos: []
    },
    // Home dashboard items
    homeItems: {
      notes: [],
      todos: []
    },
    // Search results
    searchResults: {
      notes: [],
      todos: [],
      search: null // { keyword, type, category }
    },
    // Pagination
    homePagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
      totalNotes: 0,
      totalTodos: 0
    },
    searchPagination: {
      page: 1,
      limit: 20,
      totalItems: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
      totalNotes: 0,
      totalTodos: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    // Set pinned items
    setPinnedItems: (state, action) => {
      state.pinnedItems = {
        notes: action.payload.notes || [],
        todos: action.payload.todos || []
      };
    },
    
    // Set home dashboard items
    setHomeItems: (state, action) => {
      state.homeItems = {
        notes: action.payload.notes || [],
        todos: action.payload.todos || []
      };
    },
    
    // Set search results
    setSearchResults: (state, action) => {
      state.searchResults = {
        notes: action.payload.notes || [],
        todos: action.payload.todos || [],
        search: action.payload.search || null
      };
    },
    
    // Update individual item (for pinning, archiving, etc.)
    updateHomeItem: (state, action) => {
      const { id, type, data } = action.payload;
      
      // Helper function to update item in array
      const updateItemInArray = (array) => {
        return array.map(item => 
          item.id === id ? { ...item, ...data } : item
        );
      };
      
      // Update in pinned items
      if (type === 'note') {
        state.pinnedItems.notes = updateItemInArray(state.pinnedItems.notes);
        state.homeItems.notes = updateItemInArray(state.homeItems.notes);
        state.searchResults.notes = updateItemInArray(state.searchResults.notes);
      } else if (type === 'todo') {
        state.pinnedItems.todos = updateItemInArray(state.pinnedItems.todos);
        state.homeItems.todos = updateItemInArray(state.homeItems.todos);
        state.searchResults.todos = updateItemInArray(state.searchResults.todos);
      }
    },
    
    // Delete item from all states
    deleteHomeItem: (state, action) => {
      const { id, type } = action.payload;
      
      // Helper function to remove item from array
      const removeItemFromArray = (array) => {
        return array.filter(item => item.id !== id);
      };
      
      // Remove from all states
      if (type === 'note') {
        state.pinnedItems.notes = removeItemFromArray(state.pinnedItems.notes);
        state.homeItems.notes = removeItemFromArray(state.homeItems.notes);
        state.searchResults.notes = removeItemFromArray(state.searchResults.notes);
      } else if (type === 'todo') {
        state.pinnedItems.todos = removeItemFromArray(state.pinnedItems.todos);
        state.homeItems.todos = removeItemFromArray(state.homeItems.todos);
        state.searchResults.todos = removeItemFromArray(state.searchResults.todos);
      }
    },
    
    // Set home pagination
    setHomePagination: (state, action) => {
      state.homePagination = { ...state.homePagination, ...action.payload };
    },
    
    // Set search pagination
    setSearchPagination: (state, action) => {
      state.searchPagination = { ...state.searchPagination, ...action.payload };
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = {
        notes: [],
        todos: [],
        search: null
      };
      state.searchPagination = {
        page: 1,
        limit: 20,
        totalItems: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        totalNotes: 0,
        totalTodos: 0
      };
    },
    
    // Set loading state
    setHomeLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setHomeError: (state, action) => {
      state.error = action.payload;
    },
    
    // Clear error
    clearHomeError: (state) => {
      state.error = null;
    },
    
    // Reset home state (for logout)
    resetHomeState: (state) => {
      state.pinnedItems = { notes: [], todos: [] };
      state.homeItems = { notes: [], todos: [] };
      state.searchResults = { notes: [], todos: [], search: null };
      state.homePagination = {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        totalNotes: 0,
        totalTodos: 0
      };
      state.searchPagination = {
        page: 1,
        limit: 20,
        totalItems: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        totalNotes: 0,
        totalTodos: 0
      };
      state.loading = false;
      state.error = null;
    }
  },
});

export const {
  setPinnedItems,
  setHomeItems,
  setSearchResults,
  updateHomeItem,
  deleteHomeItem,
  setHomePagination,
  setSearchPagination,
  clearSearchResults,
  setHomeLoading,
  setHomeError,
  clearHomeError,
  resetHomeState
} = homeSlice.actions;

export default homeSlice.reducer;