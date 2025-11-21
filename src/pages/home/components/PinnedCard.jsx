import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbTack, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const PinnedCard = ({ item, onPinToggle, onTrash, onArchive }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const { type, title, content, due_date, tasks = [], updatedAt } = item;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleAction = (action) => {
    setMenuOpen(false);
    switch (action) {
      case 'unpin':
        onPinToggle(item.id, type);
        break;
      case 'trash':
        onTrash(item.id, type);
        break;
      case 'archive':
        onArchive(item.id, type);
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPreviewContent = () => {
    if (type === 'note') {
      return stripHtml(content) || "No content...";
    } else if (type === 'todo') {
      const completedTasks = tasks.filter(task => task.isCompleted || task.done).length;
      const totalTasks = tasks.length;
      return totalTasks > 0 
        ? `${completedTasks}/${totalTasks} tasks completed`
        : "No tasks";
    }
    return "";
  };

  return (
    <div className="relative flex flex-col justify-between bg-white/80 min-h-[10rem] rounded-2xl border border-accent-400/60 shadow-md backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:border-accent-400 p-4 group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-accent-700">
          <FontAwesomeIcon icon={faThumbTack} className="text-accent-700/80" />
          <h1 className="text-md font-bold pl-2 text-accent-700/70 line-clamp-1">
            {title || "Untitled"}
          </h1>
        </div>

        <div ref={menuRef} className="relative">
          <button
            onClick={handleMenuToggle}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-accent-100"
          >
            <FontAwesomeIcon icon={faEllipsisV} className="text-accent-600 text-sm" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 w-32 bg-white/95 backdrop-blur-sm border border-accent-400/60 rounded-lg shadow-lg z-10">
              <button
                onClick={() => handleAction('unpin')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-accent-100 rounded-t-lg"
              >
                Unpin
              </button>
              <button
                onClick={() => handleAction('archive')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-accent-100"
              >
                Archive
              </button>
              <button
                onClick={() => handleAction('trash')}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
              >
                Trash
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-accent-700/60 line-clamp-3 flex-1">
        {getPreviewContent()}
      </p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-accent-700/50 capitalize">
          {type}
        </span>
        <span className="text-xs text-accent-700/50">
          {formatDate(updatedAt)}
        </span>
      </div>
    </div>
  );
};

export default PinnedCard;