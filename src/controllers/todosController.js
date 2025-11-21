import api from "../api/api";
import { setLoading, setError } from "../store/slices/authSlice";
import {
  setTodos,
  setArchivedTodos,
  setTrashedTodos,
  setSingleTodo,
  addTodo,
  updateTodoData,
  deleteTodoData,
  clearSelectedTodo,
  setPagination
} from "../store/slices/todosSlice";

const BASE_URL = "/todos";

// Helper function for consistent error handling
const getErrorMessage = (error) => {
  return error.response?.data?.message || 
         error.response?.data?.error || 
         error.response?.data?.errors?.[0]?.msg || 
         "Something went wrong";
};

// GET ALL ACTIVE TODOS WITH PAGINATION
export const getAllTodos = (userId, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });
    
    if (userId) queryParams.append('userId', userId);
    
    const { data } = await api.get(`${BASE_URL}?${queryParams.toString()}`);
 
    dispatch(setTodos(data.data || []));
    
    if (data.pagination) {

      dispatch(setPagination(data.pagination)); // For active todos
    } else {
      console.log('No pagination data found for todos');
    }
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// GET ARCHIVED TODOS WITH PAGINATION
export const getArchivedTodos = (userId, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });
    
    if (userId) queryParams.append('userId', userId);
    
    const { data } = await api.get(`${BASE_URL}/archived?${queryParams.toString()}`);
   
    
    const todos = data.data?.todos || data.data || [];
    const pagination = data.data?.pagination || data.pagination;
    
    dispatch(setArchivedTodos(todos));
    
    if (pagination) {
      
      dispatch(setArchivedPagination(pagination)); // Use archived pagination
    } else {
      console.log('No pagination data found for archived todos');
    }
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// GET TRASHED TODOS WITH PAGINATION
export const getTrashedTodos = (userId, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });
    
    if (userId) queryParams.append('userId', userId);
    
    const { data } = await api.get(`${BASE_URL}/trashed?${queryParams.toString()}`);
    
    
    const todos = data.data?.todos || data.data || [];
    const pagination = data.data?.pagination || data.pagination;
    
    dispatch(setTrashedTodos(todos));
    
    if (pagination) {

      dispatch(setTrashedPagination(pagination)); // Use trashed pagination
    } else {
      console.log('No pagination data found for trashed todos');
    }
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// ... rest of your todos controller with updated endpoints for archive/trash/pin
// GET single todo by ID
export const getTodoById = (id, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`${BASE_URL}/${id}`);
    dispatch(setSingleTodo(data.data));
    return data.data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

// CREATE todo
export const createTodo = (todoData, addToast, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.post(BASE_URL, todoData);
    
    const todo = data.data?.todo || data.todo || data.data;
    
    dispatch(addTodo(todo));
    
    if (addToast) addToast("Todo created successfully", "success");
    if (navigate) navigate("/todos");
    return { payload: todo };
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// UPDATE todo
export const updateTodo = (id, updateData, addToast, navigate) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${id}`, updateData);
    
    const todo = data.data?.todo || data.todo || data.data;
    
    dispatch(updateTodoData(todo));
    
    if (addToast) addToast("Todo updated successfully", "success");
    if (navigate) navigate(`/todos/view/${id}`);
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// DELETE todo PERMANENTLY
export const deleteTodo = (id, addToast, navigate) => async (dispatch) => {
  try {
    await api.delete(`${BASE_URL}/${id}`);
    
    dispatch(deleteTodoData(id));
    
    if (addToast) addToast("Todo deleted permanently", "info");
    if (navigate) navigate("/todos");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// MOVE TODO TO TRASH
export const trashTodo = (todoId, addToast) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${todoId}/trash`);

    dispatch(updateTodoData(data.data));

    if (addToast) addToast("Todo moved to trash", "info");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// RESTORE TODO FROM TRASH
export const restoreTodo = (todoId, addToast) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${todoId}/restore`);

    dispatch(updateTodoData(data.data));

    if (addToast) addToast("Todo restored from trash", "success");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// ARCHIVE TODO
export const archiveTodo = (todoId, addToast) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${todoId}/archive`);

    dispatch(updateTodoData(data.data));

    if (addToast) addToast("Todo archived", "info");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// UNARCHIVE TODO
export const unarchiveTodo = (todoId, addToast) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${todoId}/unarchive`);

    dispatch(updateTodoData(data.data));

    if (addToast) addToast("Todo unarchived", "success");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// TOGGLE PIN TODO
export const togglePinTodo = (todoId, addToast) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${todoId}/toggle-pin`);

    dispatch(updateTodoData(data.data));

    if (addToast) addToast(`Todo ${data.data.isPinned ? 'pinned' : 'unpinned'}`, "success");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// Clear selected todo
export const clearTodo = () => (dispatch) => {
  dispatch(clearSelectedTodo());
};