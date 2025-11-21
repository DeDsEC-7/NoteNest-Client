import { useState } from "react";
import Layout from "../../components/layout/Layout";
import ProfileSection from "../../components/account/ProfileSection";
import ChangePasswordSection from "../../components/account/ChangePasswordSection";
import SettingsSection from "../../components/account/SettingsSection";
import { useToast } from "../../components/layout/ToastProvider";
const Account = () => {
  const [autoSave, setAutoSave] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
 const { addToast } = useToast();
  return (
    <Layout>
       <span className=" self-start font-bold text-primary-600 text-lg sm:text-xl  flex mb-4"><h1 className="">My Account</h1></span>

      <div className="mx-auto max-w-5xl w-full px-2 md:px-0 mt-4 flex flex-col gap-6">
  
        {/* Profile Section */}
        <ProfileSection autoSave={autoSave} addToast={addToast}/>

        {/* Change Password Section */}
        <ChangePasswordSection passwords={passwords} setPasswords={setPasswords} addToast={addToast}/>

        {/* Settings Section */}
        <SettingsSection autoSave={autoSave} setAutoSave={setAutoSave} addToast={addToast}/>

      </div>
    </Layout>
  );
};

export default Account;
