import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getArchivedNotes, 
  editNote, 
  trashNote, 
  unarchiveNote 
} from "../../controllers/notesController";
import Layout from "../../components/layout/Layout";
import NotesCard from "../../components/shared/NotesCard";
import NotesCardSkeleton from "../../components/shared/NotesCardSkeleton";
import Search from "./Search";

const ArchivedNotes = () => {
  const dispatch = useDispatch();
  const { archivedNotes, loading: notesLoading } = useSelector((state) => state.notes);
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const userId = user?.user_id;

  useEffect(() => {
    if (userId) {
      dispatch(getArchivedNotes(userId));
    }
  }, [dispatch, userId]);

  // Handle pin/unpin note
  const handlePinNote = (note) => {
    dispatch(editNote(note.id, { isPinned: !note.isPinned }));
  };

  // Handle delete (move to trash)
  const handleDelete = (note) => {
    if (confirm("Are you sure you want to trash this archived note?")) {
      dispatch(trashNote(note.id));
    }
  };

  // Handle unarchive
  const handleUnarchive = (note) => {
    dispatch(unarchiveNote(note.id));
  };

  // Sort notes: pinned first, then by update date
  const sortedNotes = [...archivedNotes].sort((a, b) => {
    // Pinned notes first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by update date (newest first)
    return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
  });

  const isLoading = notesLoading || authLoading;

  if (isLoading) {
    return (
      <Layout>
        <span className="self-start font-bold text-color-warning text-lg sm:text-xl mb-4">
          <h1>Archived Notes</h1>
        </span>

        <Search isArchivePage={true} showAddButton={false} />

        <div className="border-2 border-dashed border-color-warning/30 
                        w-full rounded-3xl p-3 flex flex-col 
                        gap-2 max-h-94 overflow-auto">
          {[...Array(3)].map((_, index) => (
            <NotesCardSkeleton key={index} />
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <span className="self-start font-bold text-color-warning text-lg sm:text-xl mb-4">
        <h1>Archived Notes</h1>
      </span>

      <Search isArchivePage={true} showAddButton={false} />

      <div className="border-2 border-dashed border-color-warning/30 
                      w-full rounded-3xl p-3 flex flex-col 
                      gap-2 max-h-94 overflow-auto">

        {sortedNotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-typo-secondary mb-4">No archived notes yet</p>
            <p className="text-typo-muted text-sm">
              Notes you archive will appear here
            </p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <NotesCard
              key={note.id}
              id={note.id}
              title={note.title}
              preview={note.content || "No content..."}
              date={note.updatedAt}
              isPinned={note.isPinned || false}
              isArchived={true}
              isTrash={false}
              onDelete={() => handleDelete(note)}
              onArchive={() => handleUnarchive(note)}
              onPin={() => handlePinNote(note)}
              onRestore={() => {}}
            />
          ))
        )}
      </div>
    </Layout>
  );
};

export default ArchivedNotes;