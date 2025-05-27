// components/Auth/ProtectedRoute.jsx
"use client"
import { Navigate, Outlet, useLocation } from "react-router-dom"; // Import Outlet
import { useAuth } from "../../contexts/AuthContext";    // Ensure this path is correct

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // While AuthContext is loading its state, display a loading indicator.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If loading is complete and the user is NOT authenticated,
    // redirect them to the login page, saving the intended location.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If loading is complete and the user IS authenticated, render the Outlet.
  // The Outlet will render the matched child route (e.g., Dashboard, CreateQuiz).
  return <Outlet />;
};

export default ProtectedRoute;