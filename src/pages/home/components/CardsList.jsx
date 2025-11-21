import NotesCard from "../../../components/shared/NotesCard";
import TodosCard from "../../../components/shared/TodosCard";

const CardList = ({ items, onPinToggle, onTrash, onArchive, isSearchResults = false }) => {
  const { notes = [], todos = [] } = items;

  // Combine and sort items by date (newest first)
  const allItems = [
    ...notes.map(note => ({ ...note, type: 'note' })),
    ...todos.map(todo => ({ ...todo, type: 'todo' }))
  ].sort((a, b) => new Date(b.updatedAt || b.created_at) - new Date(a.updatedAt || a.created_at));

  if (allItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full p-2 flex flex-col gap-2">
      {allItems.map((item) => {
        if (item.type === 'note') {
          return (
            <NotesCard
              key={`note-${item.id}`}
              id={item.id}
              title={item.title}
              preview={item.content || "No content..."}
              date={item.updatedAt || item.created_at}
              isPinned={item.isPinned || false}
              isArchived={item.isArchived || false}
              isTrash={item.isTrash || false}
              onDelete={() => onTrash(item.id, 'note')}
              onArchive={() => onArchive(item.id, 'note')}
              onPin={() => onPinToggle(item.id, 'note')}
            />
          );
        } else if (item.type === 'todo') {
          return (
            <TodosCard
              key={`todo-${item.id}`}
              id={item.id}
              title={item.title}
              due={item.due_date || item.dueDate || "No due date"}
              isPinned={item.isPinned || false}
              isArchived={item.isArchived || false}
              isTrash={item.isTrash || false}
              tasks={
                item.tasks?.map((task) => ({
                  id: task.id,
                  text: task.title || task.text,
                  done: task.isCompleted || task.done,
                  isCompleted: task.isCompleted || task.done
                })) || []
              }
              onDelete={() => onTrash(item.id, 'todo')}
              onArchive={() => onArchive(item.id, 'todo')}
              onPin={() => onPinToggle(item.id, 'todo')}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default CardList;