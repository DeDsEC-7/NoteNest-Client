import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [], // Active todos
    archivedTodos: [], // Archived todos
    trashedTodos: [], // Trashed todos
    selectedTodo: null,
    // Separate pagination for each type
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    },
    archivedPagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    },
    trashedPagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  },
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
    setArchivedTodos: (state, action) => {
      state.archivedTodos = action.payload;
    },
    setTrashedTodos: (state, action) => {
      state.trashedTodos = action.payload;
    },
    setSingleTodo: (state, action) => {
      state.selectedTodo = action.payload;
    },
    addTodo: (state, action) => {
      state.todos.unshift(action.payload);
    },
    updateTodoData: (state, action) => {
      const updatedTodo = action.payload;
      // Update in all relevant arrays
      state.todos = state.todos.map((t) =>
        t.id === updatedTodo.id ? updatedTodo : t
      );
      state.archivedTodos = state.archivedTodos.map((t) =>
        t.id === updatedTodo.id ? updatedTodo : t
      );
      state.trashedTodos = state.trashedTodos.map((t) =>
        t.id === updatedTodo.id ? updatedTodo : t
      );
      // Also update selectedTodo if it matches
      if (state.selectedTodo && state.selectedTodo.id === updatedTodo.id) {
        state.selectedTodo = updatedTodo;
      }
    },
    deleteTodoData: (state, action) => {
      const id = action.payload;
      state.todos = state.todos.filter((t) => t.id !== id);
      state.archivedTodos = state.archivedTodos.filter((t) => t.id !== id);
      state.trashedTodos = state.trashedTodos.filter((t) => t.id !== id);
      // Clear selectedTodo if it's the one being deleted
      if (state.selectedTodo && state.selectedTodo.id === id) {
        state.selectedTodo = null;
      }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setArchivedPagination: (state, action) => {
      state.archivedPagination = { ...state.archivedPagination, ...action.payload };
    },
    setTrashedPagination: (state, action) => {
      state.trashedPagination = { ...state.trashedPagination, ...action.payload };
    },
    // ... keep your existing task-specific reducers
    addTaskToTodo: (state, action) => {
      const { todoId, task } = action.payload;
      if (!task || !task.id) return;
      
      // Update in todos array
      const todo = state.todos.find(t => t.id === todoId);
      if (todo) {
        if (!todo.tasks) todo.tasks = [];
        const existingIndex = todo.tasks.findIndex(t => t && t.id === task.id);
        if (existingIndex === -1) {
          todo.tasks.push(task);
        }
      }
      // Also update in archived todos
      const archivedTodo = state.archivedTodos.find(t => t.id === todoId);
      if (archivedTodo) {
        if (!archivedTodo.tasks) archivedTodo.tasks = [];
        const existingIndex = archivedTodo.tasks.findIndex(t => t && t.id === task.id);
        if (existingIndex === -1) {
          archivedTodo.tasks.push(task);
        }
      }
      // Also update selectedTodo if it matches
      if (state.selectedTodo && state.selectedTodo.id === todoId) {
        if (!state.selectedTodo.tasks) state.selectedTodo.tasks = [];
        const existingIndex = state.selectedTodo.tasks.findIndex(t => t && t.id === task.id);
        if (existingIndex === -1) {
          state.selectedTodo.tasks.push(task);
        }
      }
    },
    updateTaskInTodo: (state, action) => {
      const { todoId, task } = action.payload;
      if (!task || !task.id) return;
      
      // Update in todos array
      const todo = state.todos.find(t => t.id === todoId);
      if (todo && todo.tasks) {
        const taskIndex = todo.tasks.findIndex(t => t && t.id === task.id);
        if (taskIndex !== -1) {
          todo.tasks[taskIndex] = task;
        }
      }
      // Update in archived todos
      const archivedTodo = state.archivedTodos.find(t => t.id === todoId);
      if (archivedTodo && archivedTodo.tasks) {
        const taskIndex = archivedTodo.tasks.findIndex(t => t && t.id === task.id);
        if (taskIndex !== -1) {
          archivedTodo.tasks[taskIndex] = task;
        }
      }
      // Also update selectedTodo if it matches
      if (state.selectedTodo && state.selectedTodo.id === todoId && state.selectedTodo.tasks) {
        const taskIndex = state.selectedTodo.tasks.findIndex(t => t && t.id === task.id);
        if (taskIndex !== -1) {
          state.selectedTodo.tasks[taskIndex] = task;
        } else {
          // If task doesn't exist in selectedTodo, add it (shouldn't happen but safety)
          state.selectedTodo.tasks.push(task);
        }
      }
    },
    deleteTaskFromTodo: (state, action) => {
      const { todoId, taskId } = action.payload;
      if (!taskId) return;
      
      // Update in todos array
      const todo = state.todos.find(t => t.id === todoId);
      if (todo && todo.tasks) {
        todo.tasks = todo.tasks.filter(t => t && t.id !== taskId);
      }
      // Update in archived todos
      const archivedTodo = state.archivedTodos.find(t => t.id === todoId);
      if (archivedTodo && archivedTodo.tasks) {
        archivedTodo.tasks = archivedTodo.tasks.filter(t => t && t.id !== taskId);
      }
      // Also update selectedTodo if it matches
      if (state.selectedTodo && state.selectedTodo.id === todoId && state.selectedTodo.tasks) {
        state.selectedTodo.tasks = state.selectedTodo.tasks.filter(t => t && t.id !== taskId);
      }
    },
    clearSelectedTodo: (state) => {
      state.selectedTodo = null;
    }
  },
});

export const {
  setTodos,
  setArchivedTodos,
  setTrashedTodos,
  setSingleTodo,
  addTodo,
  updateTodoData,
  deleteTodoData,
  setPagination,
  setArchivedPagination,
  setTrashedPagination,
  addTaskToTodo,
  updateTaskInTodo,
  deleteTaskFromTodo,
  clearSelectedTodo
} = todosSlice.actions;

export default todosSlice.reducer;