import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../components/layout/ToastProvider";
import { useParams } from "react-router";
import { toggleAutoSave } from "../../controllers/authController";
import {
  getTodoById,
  createTodo,
  updateTodo,
  clearTodo
} from "../../controllers/todosController";
import {
  createTask,
  updateTask,
  deleteTask
} from "../../controllers/tasksController";

// Import components
import EditTodoHeader from "../../components/todos/EditTodoHeader";
import AddTask from "../../components/todos/AddTask";
import TaskList from "../../components/todos/TaskList";
import EditTodoEmptyState from "../../components/todos/EditTodoEmptyState";
import EditTodoLoading from "../../components/todos/EditTodoLoading";

const EditTodo = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { todoId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { todos, selectedTodo } = useSelector((state) => state.todos);

  const [title, setTitle] = useState("Untitled Todo List");
  const [newTask, setNewTask] = useState("");
  const [autoSave, setAutoSave] = useState(user?.autosave || false);
  const [currentTodoId, setCurrentTodoId] = useState(todoId || null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Safe task access with defaults
  const tasks = selectedTodo?.tasks || [];
  const pending = tasks.filter(task => task && !(task.isCompleted || false));
  const completed = tasks.filter(task => task && (task.isCompleted || false));

  // Utility functions
  const formatDueDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDueToday = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const due = new Date(dateString);
    return due.toDateString() === today.toDateString();
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const due = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Event handlers
  const handleAutosave = () => {
    const newAutoSave = !autoSave;
    setAutoSave(newAutoSave);
    dispatch(toggleAutoSave(newAutoSave, addToast, user));
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) {
      addToast("Please enter a task title", "warning");
      return;
    }

    try {
      if (!currentTodoId) {
        const todoData = { title: title || "Untitled Todo List" };
        if (dueDate) todoData.due_date = dueDate;
        
        const result = await dispatch(createTodo(todoData, addToast));
        
        if (result.payload?.id) {
          const newTodoId = result.payload.id;
          setCurrentTodoId(newTodoId);
          await dispatch(createTask({ 
            title: newTask.trim(), 
            todoId: newTodoId,
            isCompleted: false
          }, addToast));
        }
      } else {
        await dispatch(createTask({ 
          title: newTask.trim(), 
          todoId: currentTodoId,
          isCompleted: false
        }, addToast));
      }
      
      setNewTask("");
    } catch (error) {
      addToast("Failed to add task", "error");
    }
  };

  const handleToggleTask = async (task) => {
    if (!task?.id) return;
    
    try {
      await dispatch(updateTask(task.id, { 
        isCompleted: !(task.isCompleted || false),
        todoId: currentTodoId 
      }, addToast));
    } catch (error) {
      addToast("Failed to update task", "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!taskId) return;
    
    try {
      await dispatch(deleteTask(currentTodoId, taskId, addToast));
    } catch (error) {
      addToast("Failed to delete task", "error");
    }
  };

  const handleManualSave = async () => {
    try {
      if (!currentTodoId) {
        const todoData = { title: title || "Untitled Todo List" };
        if (dueDate) todoData.due_date = dueDate;
        
        const result = await dispatch(createTodo(todoData, addToast));
        
        if (result.payload?.id) {
          setCurrentTodoId(result.payload.id);
          setHasUnsavedChanges(false);
        }
      } else {
        const updateData = { title };
        if (dueDate) updateData.due_date = dueDate;
        await dispatch(updateTodo(currentTodoId, updateData, addToast));
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      addToast("Failed to save todo", "error");
    }
  };

  const handleClearDueDate = () => {
    setDueDate("");
    setHasUnsavedChanges(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  // Effects
  useEffect(() => {
    const loadData = async () => {
      if (currentTodoId) {
        await dispatch(getTodoById(currentTodoId, addToast));
      }
      setIsLoaded(true);
    };
    
    loadData();

    return () => {
      dispatch(clearTodo());
    };
  }, [dispatch, currentTodoId, addToast]);

  useEffect(() => {
    if (selectedTodo && selectedTodo.id === currentTodoId) {
      setTitle(selectedTodo.title || "Untitled Todo List");
      setDueDate(selectedTodo.due_date || "");
    }
  }, [selectedTodo, currentTodoId]);

  useEffect(() => {
    if (!autoSave || !currentTodoId || !isLoaded || !hasUnsavedChanges) return;
    
    const timeout = setTimeout(() => {
      const updateData = { title };
      if (dueDate) updateData.due_date = dueDate;
      dispatch(updateTodo(currentTodoId, updateData, addToast));
      setHasUnsavedChanges(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [title, dueDate, autoSave, currentTodoId, dispatch, addToast, isLoaded, hasUnsavedChanges]);

  useEffect(() => {
    if (isLoaded && currentTodoId) {
      const hasTitleChanged = title !== (selectedTodo?.title || "Untitled Todo List");
      const hasDueDateChanged = dueDate !== (selectedTodo?.due_date || "");
      setHasUnsavedChanges(hasTitleChanged || hasDueDateChanged);
    }
  }, [title, dueDate, isLoaded, currentTodoId, selectedTodo]);

  // Render
  if (!isLoaded) {
    return (
      <Layout>
        <EditTodoLoading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl w-full  md:px-0 mt-4 flex flex-col gap-5">
        <EditTodoHeader
          title={title}
          setTitle={setTitle}
          dueDate={dueDate}
          setDueDate={setDueDate}
          autoSave={autoSave}
          toggleAutoSave={handleAutosave}
          manualSave={handleManualSave}
          hasUnsavedChanges={hasUnsavedChanges}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          formatDueDate={formatDueDate}
          isOverdue={isOverdue}
          isDueToday={isDueToday}
          onClearDueDate={handleClearDueDate}
        />

        {currentTodoId && (
          <>
            <AddTask
              newTask={newTask}
              setNewTask={setNewTask}
              onAddTask={handleAddTask}
              onKeyPress={handleKeyPress}
              disabled={!newTask.trim()}
            />

            <TaskList
              tasks={pending}
              title="Pending Tasks"
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              emptyMessage="No pending tasks"
            />

            <TaskList
              tasks={completed}
              title="Completed Tasks"
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              completed={true}
              emptyMessage="No completed tasks"
            />
          </>
        )}

        {!currentTodoId && (
          <EditTodoEmptyState onManualSave={handleManualSave} />
        )}
      </div>
    </Layout>
  );
};

export default EditTodo;