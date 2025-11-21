import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import Layout from "../../components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { toggleAutoSave } from "../../controllers/authController";
import { useToast } from "../../components/layout/ToastProvider";
import { createNote, getNoteById, editNote } from "../../controllers/notesController";

// Import components
import EditNoteHeader from "../../components/notes/EditNoteHeader";
import NoteEditor from "../../components/notes/NoteEditor";
import EditNoteLoading from "../../components/notes/EditNoteLoading";

const EditNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const user = useSelector((state) => state.auth.user);
  const selectedNote = useSelector((state) => state.notes.selectedNote);

  const [title, setTitle] = useState("Untitled Note");
  const [content, setContent] = useState("");
  const [autoSave, setAutoSave] = useState(user?.autosave || false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [createdNoteId, setCreatedNoteId] = useState(null); // Track created note ID

  const saveTimeout = useRef(null);

  // Determine if we're editing an existing note or creating a new one
  const isEditing = Boolean(noteId);
  const currentNoteId = createdNoteId || noteId;

  // Fetch note if editing
  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        await dispatch(getNoteById(noteId, addToast));
      }
      setIsLoaded(true);
    };

    loadNote();
  }, [noteId, dispatch, addToast]);

  // Update local state when selectedNote changes
  useEffect(() => {
    if (selectedNote && (noteId || createdNoteId)) {
      setTitle(selectedNote.title || "Untitled Note");
      setContent(selectedNote.content || "");
    }
  }, [selectedNote, noteId, createdNoteId]);

  // Track changes for unsaved changes indicator
  useEffect(() => {
    if (isLoaded && (noteId || createdNoteId)) {
      const hasTitleChanged = title !== (selectedNote?.title || "Untitled Note");
      const hasContentChanged = content !== (selectedNote?.content || "");
      setHasUnsavedChanges(hasTitleChanged || hasContentChanged);
    } else if (!noteId && !createdNoteId && (title !== "Untitled Note" || content !== "")) {
      setHasUnsavedChanges(true);
    }
  }, [title, content, isLoaded, noteId, selectedNote, createdNoteId]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges) return;
    if (!title && !content) return; // nothing to save

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      const noteData = { title, content };

      if (currentNoteId) {
        // UPDATE existing note (either originally loaded or newly created)
        dispatch(editNote(currentNoteId, noteData, addToast));
        setHasUnsavedChanges(false);
      } else {
        // CREATE new note
        dispatch(createNote({ ...noteData, userId: user.user_id }, addToast, navigate))
          .then((result) => {
            if (result?.data?.id) {
              // Store the created note ID and update URL
              setCreatedNoteId(result.data.id);
              navigate(`/notes/edit/${result.data.id}`, { replace: true });
              setHasUnsavedChanges(false);
            }
          });
      }
    }, 1000); // 1s debounce

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [
    title, 
    content, 
    autoSave, 
    hasUnsavedChanges, 
    dispatch, 
    currentNoteId, 
    addToast, 
    user?.user_id, 
    navigate
  ]);

  // Event handlers
  const handleAutosave = () => {
    const newAutoSave = !autoSave;
    setAutoSave(newAutoSave);
    dispatch(toggleAutoSave(newAutoSave, addToast, user));
  };

  const handleManualSave = () => {
    const noteData = { title, content };

    if (currentNoteId) {
      // Update existing note
      dispatch(editNote(currentNoteId, noteData, addToast));
      setHasUnsavedChanges(false);
    } else {
      // Create new note
      dispatch(createNote({ ...noteData, userId: user.user_id }, addToast))
        .then((result) => {
          if (result?.data?.id) {
            setCreatedNoteId(result.data.id);
            navigate(`/notes/edit/${result.data.id}`, { replace: true });
            setHasUnsavedChanges(false);
          }
        });
    }
  };

  const handleArchive = () => {
    addToast("Archive functionality coming soon", "info");
  };

  const handleDelete = () => {
    if (currentNoteId) {
      // Delete existing note
      addToast("Delete functionality coming soon", "info");
    } else {
      // Exit without saving new note
      navigate("/notes");
    }
  };

  // Render loading state
  if (!isLoaded) {
    return (
      <Layout>
        <EditNoteLoading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl w-full mt-4 flex flex-col gap-5">
        <EditNoteHeader
          title={title}
          setTitle={setTitle}
          autoSave={autoSave}
          toggleAutoSave={handleAutosave}
          manualSave={handleManualSave}
          onArchive={handleArchive}
          onDelete={handleDelete}
          hasUnsavedChanges={hasUnsavedChanges}
          isEditing={isEditing || Boolean(createdNoteId)}
        />

        <NoteEditor
          content={content}
          setContent={setContent}
          placeholder="Write your notes here..."
        />
      </div>
    </Layout>
  );
};

export default EditNote;