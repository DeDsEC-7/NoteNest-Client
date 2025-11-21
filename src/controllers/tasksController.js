import api from "../api/api";
import { setLoading, setError } from "../store/slices/authSlice";
import {
  addTaskToTodo,
  updateTaskInTodo,
  deleteTaskFromTodo,
  setSingleTodo
} from "../store/slices/todosSlice";

const BASE_URL = "/tasks";

// Helper function for consistent error handling
const getErrorMessage = (error) => {
  return error.response?.data?.message || 
         error.response?.data?.error || 
         error.response?.data?.errors?.[0]?.msg || 
         "Something went wrong";
};

// CREATE task (embedded in todo)
export const createTask = (taskData, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.post(BASE_URL, taskData);
    
    // Your backend returns { data: { task: taskObject } } or similar
    const task = data.data?.task || data.task || data.data;
    
    if (!task || !task.id) {
      throw new Error("Invalid task data received from server");
    }
    
    // Add task to the specific todo in the state
    dispatch(addTaskToTodo({
      todoId: taskData.todoId,
      task: task
    }));
    
    if (addToast) addToast("Task created successfully", "success");
    return { payload: task };
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// UPDATE task (embedded in todo) - FIXED
export const updateTask = (id, updateData, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.put(`${BASE_URL}/${id}`, updateData);
    
    console.log("Update task response:", data); // Debug log
    
    // Your backend returns { message: "Task updated", success: true, task: taskObject }
    const task = data.task || data.data?.task || data.data;
    
    if (!task || !task.id) {
      throw new Error("Invalid task data received from server");
    }
    
    // Update task in the specific todo in the state
    dispatch(updateTaskInTodo({
      todoId: updateData.todoId,
      task: task
    }));
    
    if (addToast) addToast("Task updated successfully", "success");
  } catch (error) {
    console.log("Update task error:", error);
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// DELETE task (embedded in todo)
export const deleteTask = (todoId, taskId, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.delete(`${BASE_URL}/${taskId}`);
    
    // Remove task from the specific todo in the state
    dispatch(deleteTaskFromTodo({
      todoId,
      taskId
    }));
    
    if (addToast) addToast("Task deleted successfully", "info");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// GET tasks for a todo (if you need to refresh a single todo with its tasks)
export const refreshTodoWithTasks = (todoId, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/todos/${todoId}`);
    
    // This will update the todo with its embedded tasks
    dispatch(setSingleTodo(data.data));
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};