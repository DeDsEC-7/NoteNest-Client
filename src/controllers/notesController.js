import api from "../api/api";
import { setLoading, setError } from "../store/slices/authSlice"; 
import { 
  setNotes, 
  setArchivedNotes, 
  setTrashedNotes,
  setSingleNote, 
  addNote, 
  updateNoteData, 
  deleteNoteData,
  setPagination
} from "../store/slices/notesSlice"

const BASE_URL = "/notes";

// Helper function for consistent error handling
const getErrorMessage = (error) => {
  return error.response?.data?.message || 
         error.response?.data?.error || 
         error.response?.data?.errors?.[0]?.msg || 
         "Something went wrong";
};

// GET ALL ACTIVE NOTES WITH PAGINATION
// GET ALL ACTIVE NOTES WITH PAGINATION

// GET ALL ACTIVE NOTES WITH PAGINATION
export const getAllNotes = (userId, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });
    
    if (userId) queryParams.append('userId', userId);
    
    const { data } = await api.get(`${BASE_URL}?${queryParams.toString()}`);
   
    dispatch(setNotes(data.data || []));
    
    if (data.pagination) {
      
      dispatch(setPagination(data.pagination)); // For active notes
    } else {
    
    }
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// GET ARCHIVED NOTES WITH PAGINATION
export const getArchivedNotes = (userId, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });
    
    if (userId) queryParams.append('userId', userId);
    
    const { data } = await api.get(`${BASE_URL}/archived?${queryParams.toString()}`);

    const notes = data.data?.notes || data.data || [];
    const pagination = data.data?.pagination || data.pagination;

    dispatch(setArchivedNotes(notes));
    
    if (pagination) {
 
      dispatch(setArchivedPagination(pagination)); // Use archived pagination
    } else {
      console.log('No pagination data found for archived notes');
    }
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// GET TRASHED NOTES WITH PAGINATION
export const getTrashedNotes = (userId, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });
    
    if (userId) queryParams.append('userId', userId);
    
    const { data } = await api.get(`${BASE_URL}/trashed?${queryParams.toString()}`);


    const notes = data.data?.notes || data.data || [];
    const pagination = data.data?.pagination || data.pagination;

    dispatch(setTrashedNotes(notes));
    
    if (pagination) {
  
      dispatch(setTrashedPagination(pagination)); // Use trashed pagination
    } else {
      console.log('No pagination data found for trashed notes');
    }
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// GET PINNED NOTES WITH PAGINATION
export const getPinnedNotes = (userId, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });
    
    if (userId) queryParams.append('userId', userId);
    
    const { data } = await api.get(`${BASE_URL}/pinned?${queryParams.toString()}`);
 
    // FIX: Handle consistent response structure for pinned notes
    const notes = data.data?.notes || data.data || [];
    const pagination = data.data?.pagination || data.pagination;

    // You might want to add a separate state for pinned notes
    // For now, using setNotes or create a new action like setPinnedNotes
    dispatch(setNotes(notes));
    
    if (pagination) {
     
      dispatch(setPagination(pagination));
    } else {
      console.log('No pagination data found for pinned notes'); // Debug log
    }
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};
// GET SINGLE NOTE
export const getNoteById = (id, addToast) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.get(`${BASE_URL}/${id}`);
    dispatch(setSingleNote(data.data));
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  } finally {
    dispatch(setLoading(false));
  }
};

// CREATE NOTE
// CREATE NOTE - Modified to return the result
export const createNote = (noteData, addToast, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.post(`${BASE_URL}`, noteData);
   
    // Update both the notes list and selectedNote
    dispatch(addNote(data.data));
    dispatch(setSingleNote(data.data)); // This is the key fix - update selectedNote
    navigate(`/notes/view/${data.data.id}`);
    if (addToast) addToast("Note created successfully", "success");
    
    // Return the result so the component can get the new note ID
    return { data };
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// UPDATE NOTE
export const editNote = (noteId, updateData, addToast, navigate) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${noteId}`, updateData);

    dispatch(updateNoteData(data.data));

    if (addToast) addToast("Note updated successfully", "success");
    if (navigate) navigate(`/notes/${noteId}`);
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// DELETE NOTE PERMANENTLY
export const deleteNote = (id, addToast, navigate) => async (dispatch) => {
  try {
    await api.delete(`${BASE_URL}/${id}`);

    dispatch(deleteNoteData(id));

    if (addToast) addToast("Note deleted permanently", "info");
    if (navigate) navigate("/notes");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// MOVE NOTE TO TRASH
export const trashNote = (noteId, addToast) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${noteId}/trash`);

    dispatch(updateNoteData(data.data));

    if (addToast) addToast("Note moved to trash", "info");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// RESTORE NOTE FROM TRASH
export const restoreNote = (noteId, addToast) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${noteId}/restore`);

    dispatch(updateNoteData(data.data));

    if (addToast) addToast("Note restored from trash", "success");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// ARCHIVE NOTE
export const archiveNote = (noteId, addToast) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${noteId}/archive`);

    dispatch(updateNoteData(data.data));

    if (addToast) addToast("Note archived", "info");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// UNARCHIVE NOTE
export const unarchiveNote = (noteId, addToast) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${noteId}/unarchive`);

    dispatch(updateNoteData(data.data));

    if (addToast) addToast("Note unarchived", "success");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};

// TOGGLE PIN NOTE
export const togglePinNote = (noteId, addToast) => async (dispatch) => {
  try {
    const { data } = await api.put(`${BASE_URL}/${noteId}/toggle-pin`);

    dispatch(updateNoteData(data.data));

    if (addToast) addToast(`Note ${data.data.isPinned ? 'pinned' : 'unpinned'}`, "success");
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(setError(message));
    if (addToast) addToast(message, "error");
  }
};