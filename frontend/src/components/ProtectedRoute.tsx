import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = useAuthStore((state) => state.token); // Перевіряємо, чи є токен щоб визначити чи аутентифікований користувач
  console.log("ProtectedRoute check:", {
    path: location.pathname,
    hasToken: !!token,
  });
  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
