import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircle,
  faClock,
  faListCheck,
  faTrash,
  faArchive,
  faThumbtack,
  faBoxArchive,
  faTrashArrowUp,
  faRotateLeft,
  faTrashAlt // New icon for permanent delete
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date)) return "";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TodosCard = ({
  id,
  title = "Untitled Task",
  tasks = [],
  due = "No due date",
  isPinned = false,
  isArchived = false,
  isTrash = false,
  onDelete = () => {},
  onArchive = () => {},
  onPin = () => {},
  onRestore = () => {},
}) => {
  const completedCount = tasks.filter((t) => t.isCompleted || t.done).length;
  const totalTasks = tasks.length;

  // Determine if the card content should be clickable
  const isClickable = !isTrash && !isArchived;

  // Determine card styling based on status
  const getCardStyles = () => {
    if (isTrash) {
      return 'border-color-warning/30 bg-white/70 hover:border-color-error/50';
    }
    if (isArchived) {
      return 'border-color-warning/70 bg-white/70 hover:border-color-warning/50';
    }
    if (isPinned) {
      return 'border-accent-500 border-2 shadow-md bg-white/70';
    }
    return 'border-border-light hover:border-accent-400 bg-back-primary/80 hover:bg-back-highlight/30';
  };

  // Determine icon color based on status
  const getIconColor = () => {
    if (isTrash) return "text-color-error";
    if (isArchived) return "text-color-warning";
    return "text-accent-600";
  };

  // Determine text color based on status
  const getTextColor = () => {
    if (isTrash) return "text-color-error";
    if (isArchived) return "text-color-warning";
    return "text-typo-primary";
  };

  // Determine action button colors
  const getPinColor = () => {
    if (isPinned) return "text-accent-600 hover:text-accent-700";
    return "text-typo-muted hover:text-accent-500";
  };

  const getArchiveColor = () => {
    if (isArchived) return "text-color-warning hover:text-color-warning/80";
    return "text-typo-muted hover:text-color-warning";
  };

  const getDeleteColor = () => {
    if (isTrash) return "text-color-success hover:text-color-success/80";
    return "text-typo-muted hover:text-color-error";
  };

  const getPermanentDeleteColor = () => {
    return "text-color-error hover:text-color-error/80";
  };

  const getProgressColor = () => {
    if (isTrash) return "text-color-error/70";
    if (isArchived) return "text-color-warning/70";
    return "text-typo-muted";
  };

  const getTaskTextColor = () => {
    if (isTrash) return "text-color-error/80";
    if (isArchived) return "text-color-warning/80";
    return "text-typo-secondary";
  };

  // Handle button clicks with proper event prevention
  const handlePinClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPin();
  };

  const handleArchiveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onArchive();
  };

  const handleDeleteRestoreClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTrash) {
      onRestore(); // Restore from trash
    } else {
      onDelete(); // Move to trash
    }
  };

  const handlePermanentDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(); // Permanently delete
  };

  // Render clickable or non-clickable title
  const renderTitle = () => (
    <div className={`flex items-center gap-2 ${getTextColor()} ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}>
      <FontAwesomeIcon icon={faListCheck} className={getIconColor()} />
      <h3 className="font-semibold text-md truncate">{title}</h3>
      
      {/* Status badges */}
      {isPinned && !isTrash && (
        <FontAwesomeIcon 
          icon={faThumbtack} 
          className="text-accent-500 text-xs" 
          title="Pinned"
        />
      )}
      {isArchived && !isTrash && (
        <FontAwesomeIcon 
          icon={faBoxArchive} 
          className="text-color-warning text-xs" 
          title="Archived"
        />
      )}
      {isTrash && (
        <FontAwesomeIcon 
          icon={faTrash} 
          className="text-color-error text-xs" 
          title="In Trash"
        />
      )}
    </div>
  );

  return (
    <div
      className={`w-full flex flex-col justify-between
                 rounded-2xl border backdrop-blur-sm shadow-sm 
                 hover:shadow-md transition-all duration-200 p-4
                 ${getCardStyles()}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        {/* Left side */}
        <div className="flex-1 min-w-0">
          {isClickable ? (
            <Link to={`/todos/view/${id}`}>
              {renderTitle()}
            </Link>
          ) : (
            <div>
              {renderTitle()}
            </div>
          )}
        </div>

        {/* Right side (actions) */}
        <div className="flex items-center gap-3 ml-2">
          <span className={`text-xs ${getProgressColor()}`}>
            {completedCount}/{totalTasks} done
          </span>

          {/* Pin Button - Only show if not in trash and not archived */}
          {!isTrash && !isArchived && (
            <button 
              onClick={handlePinClick}
              className={`transition hover:cursor-pointer ${getPinColor()}`}
              title={isPinned ? "Unpin" : "Pin"}
            >
              <FontAwesomeIcon icon={faThumbtack} />
            </button>
          )}

          {/* Archive/Restore Button - Show different icons based on status */}
          {!isTrash && (
            <button 
              onClick={handleArchiveClick}
              className={`transition hover:cursor-pointer ${getArchiveColor()}`}
              title={isArchived ? "Unarchive" : "Archive"}
            >
              <FontAwesomeIcon icon={isArchived ? faRotateLeft : faArchive} />
            </button>
          )}

          {/* Delete/Restore Button - Show different behavior based on trash status */}
          <button 
            onClick={handleDeleteRestoreClick}
            className={`transition hover:cursor-pointer ${getDeleteColor()}`}
            title={isTrash ? "Restore from Trash" : "Move to Trash"}
          >
            <FontAwesomeIcon icon={isTrash ? faTrashArrowUp : faTrash} />
          </button>

          {/* Permanent Delete Button - Only show in trash */}
          {isTrash && (
            <button
              onClick={handlePermanentDeleteClick}
              className={`transition hover:cursor-pointer ${getPermanentDeleteColor()}`}
              title="Permanently Delete"
            >
              <FontAwesomeIcon icon={faTrashAlt} className="text-red-600"/>
            </button>
          )}
        </div>
      </div>

      {/* Task preview */}
      <ul className={`flex flex-col gap-1 text-sm my-2 ${getTaskTextColor()}`}>
        {tasks.slice(0, 3).map((task, index) => (
          <li key={task.id || index} className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={(task.isCompleted || task.done) ? faCheckCircle : faCircle}
              className={(task.isCompleted || task.done) ? 
                (isTrash ? "text-color-error/70" : 
                 isArchived ? "text-color-warning/70" : 
                 "text-accent-600") : 
                (isTrash ? "text-color-error/40" : 
                 isArchived ? "text-color-warning/40" : 
                 "text-typo-muted")}
            />
            <span className={`truncate ${(task.isCompleted || task.done) ? 
              (isTrash ? "line-through text-color-error/60" : 
               isArchived ? "line-through text-color-warning/60" : 
               "line-through text-typo-muted") : ""}`}>
              {task.text || task.title}
            </span>
          </li>
        ))}

        {tasks.length > 3 && (
          <span className={`text-xs mt-1 italic ${
            isTrash ? "text-color-error/60" : 
            isArchived ? "text-color-warning/60" : 
            "text-typo-muted"
          }`}>
            + {tasks.length - 3} more tasks...
          </span>
        )}

        {tasks.length === 0 && (
          <span className={`text-xs italic text-center py-2 ${
            isTrash ? "text-color-error/60" : 
            isArchived ? "text-color-warning/60" : 
            "text-typo-muted"
          }`}>
            No tasks yet
          </span>
        )}
      </ul>

      {/* Footer */}
      <div className={`flex items-center justify-end text-xs mt-2 ${
        isTrash ? "text-color-error/70" : 
        isArchived ? "text-color-warning/70" : 
        "text-typo-muted"
      }`}>
        <FontAwesomeIcon 
          icon={faClock} 
          className={`mr-1 ${
            isTrash ? "text-color-error/60" : 
            isArchived ? "text-color-warning/60" : 
            "text-accent-500/70"
          }`} 
        />
        {formatDate(due)}
      </div>
    </div>
  );
};

export default TodosCard;