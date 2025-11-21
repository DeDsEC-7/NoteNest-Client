const NotesCardSkeleton = () => {
  return (
    <div
      className="bg-white/80 w-full min-h-[8rem] flex flex-col justify-between
        rounded-2xl border border-primary-400/60 backdrop-blur-sm shadow-sm 
        p-4 animate-pulse"
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Icon Skeleton */}
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          {/* Title Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-32 md:w-40"></div>
        </div>

        {/* Actions Skeleton */}
        <div className="flex items-center gap-3">
          {/* Progress Skeleton */}
          <div className="h-3 bg-gray-300 rounded w-12"></div>
          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      {/* Preview Content Skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-3 bg-gray-300 rounded w-4/5"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-end mt-3">
        <div className="h-3 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  );
};

export default NotesCardSkeleton;