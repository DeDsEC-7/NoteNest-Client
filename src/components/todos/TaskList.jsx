import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";

const TaskList = ({ 
  tasks, 
  title, 
  onToggleTask, 
  onDeleteTask, 
  completed = false,
  emptyMessage = "No tasks"
}) => {
  return (
    <>
      <h2 className="text-base md:text-lg font-semibold text-accent-800 text-center mb-3">
        {title} ({tasks.length})
      </h2>
      <div className="border border-accent-300/30 backdrop-blur-md rounded-xl shadow-sm p-2 md:p-4 flex flex-col gap-2">
        {tasks.length > 0 ? tasks.map((task) => (
          task && (
            <div
              key={task.id}
              className="flex  sm:flex-row sm:items-center justify-between bg-white/80 shadow-sm rounded-lg p-3 md:p-4 hover:bg-accent-50 transition-all duration-300 transform hover:scale-[1.01]"
            >
              <div
                onClick={() => onToggleTask(task)}
                className="flex flex-1 items-center gap-3 cursor-pointer break-words"
              >
                <FontAwesomeIcon 
                  icon={completed ? faSquareCheck : faSquare} 
                  className={`text-lg md:text-xl ${
                    completed ? "text-accent-600" : "text-gray-400"
                  }`} 
                />
                <span className={`text-sm md:text-base ${
                  completed ? "line-through text-gray-500" : "text-primary-800"
                }`}>
                  {task.title}
                </span>
              </div>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => onDeleteTask(task.id)}
                className="mt-2 sm:mt-0 text-sm md:text-base text-red-500 hover:text-red-700 cursor-pointer transition-all duration-300"
              />
            </div>
          )
        )) : (
          <p className="text-center text-sm md:text-base text-gray-400 py-6">{emptyMessage}</p>
        )}
      </div>
    </>
  );
};

export default TaskList;