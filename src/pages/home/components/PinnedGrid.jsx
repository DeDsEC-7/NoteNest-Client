import PinnedCard from "./PinnedCard";

const PinnedGrid = ({ pinnedItems, onPinToggle, onTrash, onArchive }) => {
  const { notes = [], todos = [] } = pinnedItems;

  // Combine and limit pinned items for display
  const allPinnedItems = [
    ...notes.map(note => ({ ...note, type: 'note' })),
    ...todos.map(todo => ({ ...todo, type: 'todo' }))
  ].slice(0, 8); // Limit to 8 items for grid

  if (allPinnedItems.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl w-full overflow-x-auto p-2">
      <div className="grid grid-flow-col auto-cols-[90%] sm:auto-cols-[45%] lg:auto-cols-[25%] gap-4">
        {allPinnedItems.map((item) => (
          <PinnedCard 
            key={`${item.type}-${item.id}`}
            item={item}
            onPinToggle={onPinToggle}
            onTrash={onTrash}
            onArchive={onArchive}
          />
        ))}
      </div>
    </div>
  );
};

export default PinnedGrid;