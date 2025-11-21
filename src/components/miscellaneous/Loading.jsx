// src/components/miscellaneous/Loading.jsx
const Loading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-paper">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-typo-secondary text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
