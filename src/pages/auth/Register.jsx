import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../controllers/authController"; // adjust path as needed
import { setError } from "../../store/slices/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../components/layout/ToastProvider";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  // Redux state
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const { addToast } = useToast();
  // Handle registration submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (password !== cpassword) {
      dispatch(setError("Passwords do not match"));
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      dispatch(setError("All fields are required"));
      return;
    }

    // Dispatch registration action
    dispatch(
      registerUser({
        firstname: firstName,
        lastname: lastName,
        email,
        password,
      }, navigate,addToast)
    );
  };

    useEffect(() => {
    dispatch(setError(null)); // Clear any existing errors on component mount
  }, [dispatch]);
  return (
    <div className="h-screen bg-paper flex flex-col justify-center items-center px-4 font-sans">
      <div className="mb-4">
        <img src="/notenest.png" alt="NoteNest Logo" className="h-4 md:h-6  w-auto" />
      </div>

      <div className="w-full max-w-sm backdrop-blur-xs shadow-lg rounded-2xl p-6 border-2 border-dashed border-primary-600/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-typo-primary tracking-tight">
            Welcome new user
          </h1>
          <p className="text-typo-secondary text-sm mt-1">
            Create an account.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-typo-primary">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-typo-muted focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-typo-primary">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-typo-muted focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-typo-primary">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-typo-muted focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-typo-primary">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-typo-muted focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="cpassword" className="block text-sm font-medium text-typo-primary">
              Confirm Password
            </label>
            <input
              id="cpassword"
              type="password"
              placeholder="••••••••"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-typo-muted focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

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
            {loading ? "Registering ..." : "Register"}
          </button>

          {/* Login Link */}
          <Link
            to="/login"
            className="block text-center text-sm text-accent-600 hover:text-accent-700 hover:underline mt-3"
          >
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
