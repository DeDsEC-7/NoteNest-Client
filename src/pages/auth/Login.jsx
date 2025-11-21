import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../controllers/authController";
import { setError } from "../../store/slices/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../components/layout/ToastProvider";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  // Local state for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redux state
  const { user, loading, error, token } = useSelector((state) => state.auth);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      dispatch(setError("Email and password are required"));
      return;
    }
    dispatch(loginUser({ email, password }, navigate,addToast));
  };

 useEffect(() => {
    dispatch(setError(null)); // Clear any existing errors on component mount
  }, [dispatch]);
  return (
    <div className="h-screen bg-paper flex flex-col justify-center items-center px-4 font-sans">
      <div className="mb-5">
        <img src="/notenest.png" alt="NoteNest Logo" className="h-8 w-auto" />
      </div>

      <div className="w-full max-w-sm backdrop-blur-xs shadow-lg rounded-2xl p-6 border-2 border-dashed border-primary-600/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-typo-primary tracking-tight">
            Welcome Back
          </h1>
          <p className="text-typo-secondary text-sm mt-1">
            Sign in to continue managing your notes & tasks.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-typo-primary"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-typo-muted focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-typo-primary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-typo-muted focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          {/* Submit */}
         <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium tracking-wide text-white transition-all duration-300 shadow-sm flex items-center justify-center ${
              loading
                ? "bg-primary-400 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700 cursor-pointer"
            }`}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            ) : null}
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Register Link */}
          <Link
            to="/register"
            className="block text-center text-sm text-accent-600 hover:text-accent-700 hover:underline mt-3"
          >
            Don’t have an account? Register
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
