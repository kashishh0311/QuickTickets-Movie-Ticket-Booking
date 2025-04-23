import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminContext } from "../AdminContext";

const ProtectedRoute = () => {
  const { admin, loading } = useContext(AdminContext);

  if (loading) return <p>Loading...</p>; // Show loading while checking auth

  return admin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
