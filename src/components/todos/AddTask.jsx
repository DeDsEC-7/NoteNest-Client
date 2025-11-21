import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddTask = ({ 
  newTask, 
  setNewTask, 
  onAddTask, 
  onKeyPress,
  disabled = false 
}) => {
  return (
    <div className="w-full flex">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Add a new task..."
        className="flex-1 border border-accent-300/40 rounded-l-lg px-3 md:px-4 py-2 text-sm md:text-base bg-white/70 backdrop-blur-md outline-none focus:ring-1 focus:ring-accent-500 transition-all"
      />
      <button
        onClick={onAddTask}
        disabled={disabled}
        className="bg-accent-700 text-white px-4 py-2 rounded-r-lg hover:bg-accent-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm md:text-base"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default AddTask;