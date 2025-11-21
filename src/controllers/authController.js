import api from "../api/api";
import { setCredentials, logout, setLoading, setError } from "../store/slices/authSlice";
import { useNavigate } from "react-router";
const BASE_URL = "/auth";

// LOGIN
export const loginUser = (credentials, navigate, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.post(`${BASE_URL}/login`, credentials);

    localStorage.setItem("token", data.token);
    dispatch(setCredentials({ user: data.user, token: data.token }));

    if (addToast) addToast(`Welcome back, ${data.user.firstname}!`, "success");
    navigate("/home");
  } catch (error) {
    
    const status = error.response?.status;
    const message = error.response?.data?.error || error.response?.data?.message || "Login failed";
    dispatch(setError(message));
    if (addToast) addToast(message, "error");

    if (status === 403) navigate("/forbidden");
    else if (status >= 500) navigate("/server-error");
  } finally {
    dispatch(setLoading(false));
  }
};

// REGISTER
export const registerUser = (userInfo, navigate, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.post(`${BASE_URL}/register`, userInfo);

    if (addToast) addToast(`Account Registered! Proceed to Login.`, "success");
    navigate("/login");
  } catch (error) {
    
   
    const status = error.response?.status;
    let message = "Registration failed";

    if (status === 422 && Array.isArray(error.response.data.errors)) {
      message = error.response.data.errors.map((err) => err.msg).join("\n");
      dispatch(setError(message));
    } else {
      message = error.response?.data?.error || error.response?.data?.message || "Registration failed";
      dispatch(setError(message));
    }

    if (addToast) addToast(message, "error");

    if (status === 403) navigate("/forbidden");
    else if (status >= 500) navigate("/server-error");
  } finally {
    dispatch(setLoading(false));
  }
};

// LOGOUT
export const logoutUser = (navigate, addToast) => (dispatch) => {
  localStorage.removeItem("token");
  dispatch(logout());
  if (addToast) addToast("Logged out successfully", "info");
  if (navigate) navigate("/login");
};

// UPDATE PROFILE
export const updateProfile = (profileData, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.put(`${BASE_URL}/profile`, profileData);
    dispatch(setCredentials({ user: data.user, token: localStorage.getItem("token") }));
    if (addToast) addToast("Profile updated successfully", "success");
  } catch (error) {
    
    const message = error.response?.data?.error || error.response?.data?.message || "Profile update failed";
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// CHANGE PASSWORD
export const changePassword = (passwordData, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.put(`${BASE_URL}/password`, passwordData);
    if (addToast) addToast(data.message || "Password changed successfully", "success");
  } catch (error) {
    
    let message = "Password change failed";
    const status = error.response?.status;
    if (status === 422 && Array.isArray(error.response.data.errors)) {
      message = error.response.data.errors.map((err) => err.msg).join("\n");
      dispatch(setError(message));
    } else {
      message = error.response?.data?.error || error.response?.data?.message || "Password change failed";
      dispatch(setError(message));
    }
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// TOGGLE AUTOSAVE
export const toggleAutoSave = (autosave, addToast,userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
 
    const { data } = await api.put(`${BASE_URL}/autosave`, { autosave:!autosave });
   
    dispatch(setCredentials({ user: { ...userData, autosave: data.autosave }, token: localStorage.getItem("token") }));
    
    if (addToast) addToast(`AutoSave ${autosave ? "Disabled" : "Enabled"}`, "success");
  } catch (error) {
    
    const message = error.response?.data?.error || error.response?.data?.message || "Failed to update AutoSave";
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteAccount = (addToast, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    await api.delete(`${BASE_URL}/delete`);

    localStorage.removeItem("token");
    dispatch(logout());

    if (addToast) addToast("Account deleted successfully", "info");
    if (navigate) navigate("/register"); // redirect to register or login
  } catch (error) {
    
    const message = error.response?.data?.error || error.response?.data?.message || "Account deletion failed";
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

