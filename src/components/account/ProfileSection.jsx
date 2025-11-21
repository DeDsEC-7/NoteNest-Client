import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { updateProfile } from "../../controllers/authController";

const ProfileSection = ({ autoSave, addToast }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [profile, setProfile] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Keep profile state updated if user changes in Redux
  useEffect(() => {
    if (user) setProfile({ 
      firstname: user.firstname, 
      lastname: user.lastname, 
      email: user.email, 
      phone: user.phone || "" 
    });
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    // Call backend via Redux action
    dispatch(updateProfile(profile, addToast));

    // Optionally save locally if autoSave is enabled
    if (autoSave) localStorage.setItem("profile", JSON.stringify(profile));
  };

  return (
    <div className="bg-white/80 border border-accent-300/30 backdrop-blur-md shadow-sm rounded-xl p-4 md:p-5 flex flex-col gap-4">
      <h2 className="text-base md:text-lg font-semibold text-accent-800">Profile</h2>

      {/* Firstname + Lastname */}
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <span className="w-28 md:w-32 font-semibold text-accent-700 text-xs md:text-sm">
          First Name:
        </span>
        <input
          type="text"
          name="firstname"
          value={profile.firstname}
          onChange={handleProfileChange}
          className="flex-1 border border-accent-300/40 rounded-md px-3 py-2 bg-white/70 backdrop-blur-sm outline-none focus:ring-1 focus:ring-accent-500 transition-all text-xs md:text-sm"
        />

        <span className="w-28 md:w-32 font-semibold text-accent-700 text-xs md:text-sm">
          Last Name:
        </span>
        <input
          type="text"
          name="lastname"
          value={profile.lastname}
          onChange={handleProfileChange}
          className="flex-1 border border-accent-300/40 rounded-md px-3 py-2 bg-white/70 backdrop-blur-sm outline-none focus:ring-1 focus:ring-accent-500 transition-all text-xs md:text-sm"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 ">
        <span className="w-28 md:w-32 font-semibold text-accent-700 text-xs md:text-sm">
          Email:
        </span>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleProfileChange}
          disabled
          className="flex-1 border disabled:text-gray-500 disabled:border-gray-200 border-accent-300/40 rounded-md px-3 py-2 bg-white/70 backdrop-blur-sm outline-none focus:ring-1  transition-all text-xs md:text-sm"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <span className="w-28 md:w-32 font-semibold text-accent-700 text-xs md:text-sm">
          Phone:
        </span>
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleProfileChange}
          className="flex-1 border border-accent-300/40 rounded-md px-3 py-2 bg-white/70 backdrop-blur-sm outline-none focus:ring-1 focus:ring-accent-500 transition-all text-xs md:text-sm"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveProfile}
          className="bg-accent-700 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-all text-xs md:text-sm"
        >
          <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
