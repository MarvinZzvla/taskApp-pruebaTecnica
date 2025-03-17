import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const session = localStorage.getItem("session");

  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
