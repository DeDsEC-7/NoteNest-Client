import api from "../api/api";
import { setLoading, setError } from "../store/slices/authSlice";
import {
  setPinnedItems,
  setHomeItems,
  setSearchResults,
  updateHomeItem, // This is the Redux action
  deleteHomeItem, // This is the Redux action
  setHomePagination,
  setSearchPagination,
  clearSearchResults
} from "../store/slices/homeSlice";

const BASE_URL = "/home";

// Helper function for consistent error handling
const getErrorMessage = (error) => {
  return error.response?.data?.message || 
         error.response?.data?.error || 
         error.response?.data?.errors?.[0]?.msg || 
         "Something went wrong";
};

// GET HOME DASHBOARD DATA WITH PAGINATION
export const getHomeData = (userId, page = 1, limit = 10, type = 'all', keyword = '', addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      type
    });
    
    if (keyword) queryParams.append('keyword', keyword);
    if (userId) queryParams.append('userId', userId);
    
    const { data } = await api.get(`${BASE_URL}/dashboard?${queryParams.toString()}`);
    
    if (data.success) {
      // Set pinned items
      dispatch(setPinnedItems(data.data.pinned));
      
      // Set home items (notes and todos)
      dispatch(setHomeItems(data.data.items));
      
      // Set pagination
      if (data.data.pagination) {
       
        dispatch(setHomePagination(data.data.pagination));
      }
    }
    
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// SEARCH ITEMS ACROSS NOTES AND TODOS
export const searchItems = (userId, keyword, type = 'all', category = 'all', page = 1, limit = 20, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const queryParams = new URLSearchParams({
      keyword,
      type,
      category,
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (userId) queryParams.append('userId', userId);
    
    const { data } = await api.get(`${BASE_URL}/search?${queryParams.toString()}`);
    
    if (data.success) {
      dispatch(setSearchResults({
        notes: data.data.notes || [],
        todos: data.data.todos || [],
        search: data.data.search || {}
      }));
      
      if (data.data.pagination) {
      
        dispatch(setSearchPagination(data.data.pagination));
      }
    }
    
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// GET PINNED ITEMS ONLY
export const getPinnedItems = (userId, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const queryParams = new URLSearchParams();
    if (userId) queryParams.append('userId', userId);
    
    const { data } = await api.get(`${BASE_URL}/pinned?${queryParams.toString()}`);
    
    if (data.success) {
      dispatch(setPinnedItems(data.data));
    }
    
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// UPDATE ITEM (NOTE OR TODO) - For pinning, archiving, etc.
// RENAMED: updateHomeItem -> updateHomeItemData to avoid conflict
export const updateHomeItemData = (itemId, itemType, updateData, addToast) => async (dispatch) => {
  try {
    // Determine which API to call based on itemType
    let endpoint = '';
    if (itemType === 'note') {
      endpoint = `/notes/${itemId}`;
    } else if (itemType === 'todo') {
      endpoint = `/todos/${itemId}`;
    } else {
      throw new Error('Invalid item type');
    }
    
    const { data } = await api.put(endpoint, updateData);
    
    // Update the item in Redux state
    if (data.success) {
      const updatedItem = data.data;
      dispatch(updateHomeItem({ // This is the Redux action
        id: itemId,
        type: itemType,
        data: updatedItem
      }));
      
      if (addToast) {
        const action = updateData.isPinned !== undefined ? 
          (updateData.isPinned ? 'pinned' : 'unpinned') :
          'updated';
        addToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ${action} successfully`, "success");
      }
    }
    
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  }
};

// DELETE ITEM (NOTE OR TODO)
// RENAMED: deleteHomeItem -> deleteHomeItemData to avoid conflict
export const deleteHomeItemData = (itemId, itemType, addToast) => async (dispatch) => {
  try {
    // Determine which API to call based on itemType
    let endpoint = '';
    if (itemType === 'note') {
      endpoint = `/notes/${itemId}`;
    } else if (itemType === 'todo') {
      endpoint = `/todos/${itemId}`;
    } else {
      throw new Error('Invalid item type');
    }
    
    await api.delete(endpoint);
    
    // Remove the item from Redux state
    dispatch(deleteHomeItem({ // This is the Redux action
      id: itemId,
      type: itemType
    }));
    
    if (addToast) addToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully`, "success");
    
    return { success: true };
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  }
};

// MOVE ITEM TO TRASH
export const trashHomeItem = (itemId, itemType, addToast) => async (dispatch) => {
  try {
    const endpoint = `/${itemType}s/${itemId}/trash`;
    const { data } = await api.put(endpoint);
    
    if (data.success) {
      dispatch(updateHomeItem({ // This is the Redux action
        id: itemId,
        type: itemType,
        data: data.data
      }));
      
      if (addToast) addToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} moved to trash`, "info");
    }
    
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  }
};

// ARCHIVE ITEM
export const archiveHomeItem = (itemId, itemType, addToast) => async (dispatch) => {
  try {
    const endpoint = `/${itemType}s/${itemId}/archive`;
    const { data } = await api.put(endpoint);
    
    if (data.success) {
      dispatch(updateHomeItem({ // This is the Redux action
        id: itemId,
        type: itemType,
        data: data.data
      }));
      
      if (addToast) addToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} archived`, "info");
    }
    
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  }
};

// TOGGLE PIN ITEM
export const togglePinHomeItem = (itemId, itemType, addToast) => async (dispatch) => {
  try {
    const endpoint = `/${itemType}s/${itemId}/toggle-pin`;
    const { data } = await api.put(endpoint);
    
    if (data.success) {
      dispatch(updateHomeItem({ // This is the Redux action
        id: itemId,
        type: itemType,
        data: data.data
      }));
      
      if (addToast) addToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ${data.data.isPinned ? 'pinned' : 'unpinned'}`, "success");
    }
    
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  }
};

// CLEAR SEARCH RESULTS
export const clearHomeSearch = () => (dispatch) => {
  dispatch(clearSearchResults());
};