import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "../router/ProtectedRoutes";
import { useAuth } from "../providers/Auth";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import NotFoundPage from "../pages/404";
import GridRequests from "../components/Request/Grid";

const LoginRoute = () => {
    const { user } = useAuth();
    return user.isAuthenticated ? <Navigate to="/" /> : <LoginPage />
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (<ProtectedRoute>
        <HomePage />
    </ProtectedRoute>),
    children: [
      {
        path: "/",
        element: <GridRequests />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  }
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
