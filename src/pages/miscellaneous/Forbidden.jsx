import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="h-screen bg-paper flex flex-col justify-center items-center px-4 font-sans text-center">
      <div className="mb-5">
        <img src="/notenest.png" alt="NoteNest Logo" className="h-8 w-auto" />
      </div>

      <div className="w-full max-w-sm backdrop-blur-xs shadow-lg rounded-2xl p-6 border-2 border-dashed border-primary-600/30">
        <h1 className="text-6xl font-bold text-primary-600 mb-3">403</h1>
        <p className="text-lg text-typo-primary font-medium">Access Denied</p>
        <p className="text-sm text-typo-secondary mt-1 mb-6">
          You don’t have permission to view this page.
        </p>

        <Link
          to="/login"
          className="inline-block px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium tracking-wide hover:bg-primary-700 transition-all duration-300 shadow-sm"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
