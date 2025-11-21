const EditTodoEmptyState = ({ onManualSave }) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">Create a todo to start adding tasks</p>
      <button
        onClick={onManualSave}
        className="bg-accent-700 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-all duration-200"
      >
        Create Todo
      </button>
    </div>
  );
};

export default EditTodoEmptyState;