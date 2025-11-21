// components/shared/TodosCardSkeleton.jsx
const TodosCardSkeleton = ({ count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className="animate-pulse bg-white/50 rounded-2xl p-4 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-6 bg-gray-300 rounded ml-2"></div>
      </div>
      
      <div className="space-y-2 mb-3">
        {[...Array(3)].map((_, taskIndex) => (
          <div key={taskIndex} className="flex items-center gap-3">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="flex gap-2">
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  ));

  return <>{skeletons}</>;
};

export default TodosCardSkeleton;