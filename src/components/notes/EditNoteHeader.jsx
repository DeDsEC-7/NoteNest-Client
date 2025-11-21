import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faArchive,
  faTrash,
  faToggleOff,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";

const EditNoteHeader = ({
  title,
  setTitle,
  autoSave,
  toggleAutoSave,
  manualSave,
  onArchive,
  onDelete,
  onExit,
  hasUnsavedChanges = false
}) => {
  return (
    <div className="w-full bg-white/80 border border-primary-300/30 backdrop-blur-lg shadow-sm rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="font-semibold text-lg md:text-xl text-primary-600s text-primary-700 bg-transparent border-b border-primary-300/40 focus:border-primary-600 outline-none pb-1 transition-all w-full md:w-1/2"
        placeholder="Enter note title..."
      />
      
      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-6 justify-between md:justify-end w-full md:w-auto">
        {/* Autosave Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] md:text-xs text-gray-500 tracking-wide">AUTOSAVE</span>
          <FontAwesomeIcon
            icon={autoSave ? faToggleOn : faToggleOff}
            onClick={toggleAutoSave}
            className="text-xl md:text-2xl text-primary-700 cursor-pointer hover:opacity-75 transition-all"
          />
        </div>

       
        {/* Manual Save */}
        {(!autoSave || hasUnsavedChanges) && (
          <FontAwesomeIcon
            icon={faFloppyDisk}
            onClick={manualSave}
            className={`text-base md:text-lg cursor-pointer transition ${
              hasUnsavedChanges 
                ? "text-primary-600 hover:text-primary-700" 
                : "text-gray-600 hover:text-primary-600"
            }`}
            title={hasUnsavedChanges ? "Save changes" : "Save"}
          />
        )}

        
      </div>
    </div>
  );
};

export default EditNoteHeader;