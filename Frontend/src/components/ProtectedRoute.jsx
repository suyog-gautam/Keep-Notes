import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ isValid }) => {
  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
};
