import { createSlice } from "@reduxjs/toolkit";

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [], // Active notes
    archivedNotes: [], // Archived notes
    trashedNotes: [], // Trashed notes
    selectedNote: null,
    // Separate pagination for each type
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    },
    archivedPagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    },
    trashedPagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  },
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setArchivedNotes: (state, action) => {
      state.archivedNotes = action.payload;
    },
    setTrashedNotes: (state, action) => {
      state.trashedNotes = action.payload;
    },
    setSingleNote: (state, action) => {
      state.selectedNote = action.payload;
    },
    addNote: (state, action) => {
      state.notes.unshift(action.payload);
    },
    updateNoteData: (state, action) => {
      const updatedNote = action.payload;
      // Update in all relevant arrays
      state.notes = state.notes.map((n) =>
        n.id === updatedNote.id ? updatedNote : n
      );
      state.archivedNotes = state.archivedNotes.map((n) =>
        n.id === updatedNote.id ? updatedNote : n
      );
      state.trashedNotes = state.trashedNotes.map((n) =>
        n.id === updatedNote.id ? updatedNote : n
      );
    },
    deleteNoteData: (state, action) => {
      const id = action.payload;
      state.notes = state.notes.filter((n) => n.id !== id);
      state.archivedNotes = state.archivedNotes.filter((n) => n.id !== id);
      state.trashedNotes = state.trashedNotes.filter((n) => n.id !== id);
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setArchivedPagination: (state, action) => {
      state.archivedPagination = { ...state.archivedPagination, ...action.payload };
    },
    setTrashedPagination: (state, action) => {
      state.trashedPagination = { ...state.trashedPagination, ...action.payload };
    },
    clearSelectedNote: (state) => {
      state.selectedNote = null;
    },
  },
});

export const {
  setNotes,
  setArchivedNotes,
  setTrashedNotes,
  setSingleNote,
  addNote,
  updateNoteData,
  deleteNoteData,
  setPagination,
  setArchivedPagination,
  setTrashedPagination,
  clearSelectedNote,
} = notesSlice.actions;

export default notesSlice.reducer;