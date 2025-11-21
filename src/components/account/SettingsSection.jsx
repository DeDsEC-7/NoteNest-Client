import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { toggleAutoSave, deleteAccount } from "../../controllers/authController";
import { useState, useEffect } from "react";

const SettingsSection = ({ addToast }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [autoSave, setAutoSave] = useState(user?.autosave || false);

  // Sync toggle with backend when changed

  const handleAutosaveAccount = () => {

   dispatch(toggleAutoSave(autoSave,addToast,user));
   setAutoSave(!autoSave);
  };
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      dispatch(deleteAccount(addToast)); // call backend action
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Settings Card */}
      <div className="bg-white/80 border border-accent-300/30 backdrop-blur-md shadow-sm rounded-xl p-4 md:p-5 flex flex-col gap-4">
        <h2 className="text-base md:text-lg font-semibold text-accent-800">Settings</h2>

        {/* AutoSave */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <span className="w-full md:w-32 font-semibold text-accent-700 text-xs md:text-sm">
            AutoSave:
          </span>
          <FontAwesomeIcon
            icon={autoSave ? faToggleOn : faToggleOff}
            onClick={() => handleAutosaveAccount()}
            className={`text-xl md:text-2xl cursor-pointer transition-all ${
              autoSave ? "text-accent-700" : "text-gray-400 hover:text-accent-700"
            }`}
          />
        </div>
      </div>

      {/* Delete Account Button */}
      <div className="flex justify-center mt-2">
        <button
          onClick={handleDeleteAccount}
          className="flex items-center justify-center bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all shadow-md text-sm md:text-base w-full md:w-1/3"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;
