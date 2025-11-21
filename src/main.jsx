import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter,RouterProvider} from "react-router";
import "./index.css";
import ProtectedRoute from "./components/miscellaneous/ProtectedRoute";
import store from './store/store'
import { Provider } from 'react-redux'
import Loading from "./components/miscellaneous/Loading";
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { ToastProvider } from "./components/layout/ToastProvider";
// Lazy-loaded pages
const Home = lazy(() => import("./pages/home/Home"));
const Notes = lazy(() => import("./pages/notes/Notes"));
const EditNote = lazy(() => import("./pages/notes/EditNote"));
const Todos = lazy(() => import("./pages/todos/Todos"));
const EditTodo = lazy(() => import("./pages/todos/EditTodo"));
const Archive = lazy(() => import("./pages/archive/Archive"));
const Trash = lazy(() => import("./pages/trash/Trash"));
// const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/miscellaneous/NotFound"));
const Forbidden = lazy(() => import("./pages/miscellaneous/Forbidden"));
const ServerError = lazy(() => import("./pages/miscellaneous/ServerError"));
const Account = lazy(() => import("./pages/account/Account"));
// Routes definition
const router = createBrowserRouter([
  // Public routes
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/forbidden", Component: Forbidden },
  { path: "/server-error", Component: ServerError },
  { path: "*", Component: NotFound },
  { path: "/", Component: Home },
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/home", Component: Home },
      { path: "/", Component: Home },
      { path: "/notes", Component: Notes },
      { path: "/notes/view/:noteId?", Component: EditNote },
      { path: "/todos", Component: Todos },
     
      { path: "/todos/view/:todoId?", Component: EditTodo },
      { path: "/archive", Component: Archive },
      { path: "/trash", Component: Trash },
      { path: "/account", Component: Account },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
      </ToastProvider>
    </Provider>
  </StrictMode>
);

