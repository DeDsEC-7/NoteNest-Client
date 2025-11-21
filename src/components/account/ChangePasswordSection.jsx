import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { changePassword } from "../../controllers/authController";

const ChangePasswordSection = ({ passwords, setPasswords, addToast }) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSavePassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      if (addToast) addToast("New password and confirmation do not match.", "error");
      return;
    }

    dispatch(changePassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword }, addToast));

    // Clear inputs after successful change
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="bg-white/80 border border-accent-300/30 backdrop-blur-md shadow-sm rounded-xl p-4 md:p-5 flex flex-col gap-4">
      <h2 className="text-base md:text-lg font-semibold text-accent-800">Change Password</h2>

      {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
        <div key={field} className="flex flex-col md:flex-row md:items-center gap-2">
          <span className="w-28 md:w-32 font-semibold text-accent-700 text-xs md:text-sm">
            {field === "oldPassword"
              ? "Old Password"
              : field === "newPassword"
              ? "New Password"
              : "Confirm Password"}
            :
          </span>
          <input
            type="password"
            name={field}
            value={passwords[field]}
            onChange={handleChange}
            className="flex-1 border border-accent-300/40 rounded-md px-3 py-2 bg-white/70 backdrop-blur-sm outline-none focus:ring-1 focus:ring-accent-500 transition-all text-xs md:text-sm"
          />
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={handleSavePassword}
          className="bg-accent-700 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-all text-xs md:text-sm"
        >
          <FontAwesomeIcon icon={faLock} className="mr-2" />
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordSection;
