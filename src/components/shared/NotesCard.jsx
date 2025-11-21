import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faNoteSticky, 
  faClock, 
  faTrash, 
  faArchive, 
  faThumbtack,
  faBoxArchive,
  faTrashArrowUp,
  faRotateLeft,
  faTrashAlt // New icon for permanent delete
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

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

const NotesCard = ({
  id,
  title = "Untitled Note",
  preview = "No content yet...",
  date = "",
  isPinned = false,
  isArchived = false,
  isTrash = false,
  onDelete = () => {},
  onArchive = () => {},
  onPin = () => {},
  onRestore = () => {},
}) => {
  // Determine if the card content should be clickable
  const isClickable = !isTrash && !isArchived;

  // Determine card styling based on status using your color palette
 const getCardStyles = () => {
    if (isTrash) {
      return 'border-color-warning/30 bg-white/70 hover:border-color-error/50';
    }
    if (isArchived) {
      return 'border-color-warning/70 bg-white/70 hover:border-color-warning/50';
    }
    if (isPinned) {
      return 'border-primary-500 border-2  shadow-md bg-white/70';
    }
    return 'border-border-light hover:border-primary-400 bg-back-primary/80 hover:bg-back-highlight/30';
  };

  // Determine icon color based on status
  const getIconColor = () => {
    if (isTrash) return "text-color-error";
    if (isArchived) return "text-color-warning";
    return "text-primary-600";
  };

  // Determine text color based on status
  const getTextColor = () => {
    if (isTrash) return "text-color-error";
    if (isArchived) return "text-color-warning";
    return "text-typo-primary";
  };

  // Determine action button colors
  const getPinColor = () => {
    if (isPinned) return "text-primary-600 hover:text-primary-700";
    return "text-typo-muted hover:text-primary-500";
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
    <div className={`flex items-center gap-2 ${getTextColor()}`}>
      <FontAwesomeIcon 
        icon={faNoteSticky} 
        className={getIconColor()} 
      />
      <h3 className="font-semibold text-md truncate">{title}</h3>
      
      {/* Status badges */}
      {isPinned && !isTrash && (
        <FontAwesomeIcon 
          icon={faThumbtack} 
          className="text-primary-500 text-xs" 
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

  // Render clickable or non-clickable preview
  const renderPreview = () => (
    <p className={`text-xs md:text-sm line-clamp-3 mt-2 ${
      isTrash ? "text-color-error/80" : 
      isArchived ? "text-color-warning/80" : 
      "text-typo-secondary"
    }`}>
      {stripHtml(preview)}
    </p>
  );

  return (
    <div
      className={`w-full min-h-[8rem] flex flex-col justify-between
        rounded-2xl border backdrop-blur-sm shadow-sm 
        hover:shadow-md transition-all duration-200 p-4 cursor-pointer
        ${getCardStyles()}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 min-w-0">
          {isClickable ? (
            <Link to={`/notes/view/${id}`}>
              {renderTitle()}
            </Link>
          ) : (
            <div className="cursor-default">
              {renderTitle()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-2">
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
              <FontAwesomeIcon 
                icon={isArchived ? faRotateLeft : faArchive} 
              />
            </button>
          )}

          {/* Delete/Restore Button - Show different behavior based on trash status */}
          <button
            onClick={handleDeleteRestoreClick}
            className={`transition hover:cursor-pointer ${getDeleteColor()}`}
            title={isTrash ? "Restore from Trash" : "Move to Trash"}
          >
            <FontAwesomeIcon 
              icon={isTrash ? faTrashArrowUp : faTrash} 
            />
          </button>

          {/* Permanent Delete Button - Only show in trash */}
          {isTrash && (
            <button
              onClick={handlePermanentDeleteClick}
              className={`transition hover:cursor-pointer ${getPermanentDeleteColor()}`}
              title="Permanently Delete"
            >
              <FontAwesomeIcon icon={faTrashAlt} className="text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1">
        {isClickable ? (
          <Link to={`/notes/view/${id}`}>
            {renderPreview()}
          </Link>
        ) : (
          <div className="cursor-default">
            {renderPreview()}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-end text-xs mt-3 ${
        isTrash ? "text-color-error/70" : 
        isArchived ? "text-color-warning/70" : 
        "text-typo-muted"
      }`}>
        <FontAwesomeIcon 
          icon={faClock} 
          className={`mr-1 ${
            isTrash ? "text-color-error/60" : 
            isArchived ? "text-color-warning/60" : 
            "text-primary-500/70"
          }`} 
        />
        {formatDate(date)}
      </div>
    </div>
  );
};

export default NotesCard;