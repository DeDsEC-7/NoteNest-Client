import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faToggleOff,
  faToggleOn,
  faCalendar,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

const EditTodoHeader = ({
  title,
  setTitle,
  dueDate,
  setDueDate,
  autoSave,
  toggleAutoSave,
  manualSave,
  hasUnsavedChanges,
  showDatePicker,
  setShowDatePicker,
  formatDueDate,
  isOverdue,
  isDueToday,
  onClearDueDate
}) => {
  const dueDateStatus = dueDate ? 
    (isOverdue(dueDate) ? "overdue" : isDueToday(dueDate) ? "today" : "upcoming") 
    : "none";

  return (
    <div className="w-full bg-white/80 border border-accent-300/30 backdrop-blur-lg shadow-sm rounded-xl p-4 md:p-5 flex flex-col gap-4">
      {/* Title Row */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-semibold text-lg md:text-xl text-accent-800 bg-transparent border-b border-accent-300/40 focus:border-accent-600 outline-none pb-1 transition-all w-full md:w-1/2"
          placeholder="Enter todo title..."
        />
        <div className="flex items-center gap-4 md:gap-6 justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-xs text-gray-500 tracking-wide">AUTOSAVE</span>
            <FontAwesomeIcon
              icon={autoSave ? faToggleOn : faToggleOff}
              onClick={toggleAutoSave}
              className="text-xl md:text-2xl cursor-pointer transition-all text-accent-700 hover:opacity-75"
            />
          </div>
          {(!autoSave || hasUnsavedChanges) && (
            <FontAwesomeIcon
              icon={faFloppyDisk}
              onClick={manualSave}
              className={`text-base md:text-lg cursor-pointer transition ${
                hasUnsavedChanges 
                  ? "text-accent-600 hover:text-accent-700" 
                  : "text-gray-600 hover:text-accent-600"
              }`}
              title={hasUnsavedChanges ? "Save changes" : "Save"}
            />
          )}
        </div>
      </div>

      {/* Due Date Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-accent-200/30">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon 
            icon={dueDate ? faCalendarCheck : faCalendar} 
            className={`text-sm ${
              dueDateStatus === "overdue" ? "text-red-500" :
              dueDateStatus === "today" ? "text-accent-600" :
              dueDateStatus === "upcoming" ? "text-primary-500" : "text-gray-400"
            }`}
          />
          <span className="text-sm font-medium text-gray-700">Due Date:</span>
        </div>
        
        <div className="flex items-center gap-3">
          {dueDate ? (
            <>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                dueDateStatus === "overdue" ? "bg-red-100 text-red-700" :
                dueDateStatus === "today" ? "bg-accent-100 text-accent-700" :
                "bg-primary-100 text-primary-700"
              }`}>
                {formatDueDate(dueDate)}
                {dueDateStatus === "today" && " (Today)"}
                {dueDateStatus === "overdue" && " (Overdue)"}
              </span>
              <button
                onClick={onClearDueDate}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors"
              >
                Clear
              </button>
            </>
          ) : (
            <span className="text-sm text-gray-500">No due date set</span>
          )}
          
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors"
          >
            {dueDate ? "Change" : "Set Due Date"}
          </button>
        </div>
      </div>

      {/* Date Picker */}
      {showDatePicker && (
        <div className="flex items-center gap-3 pt-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
            }}
            min={new Date().toISOString().split('T')[0]}
            className="px-3 py-2 border border-accent-300 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          />
          <button
            onClick={() => setShowDatePicker(false)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default EditTodoHeader;