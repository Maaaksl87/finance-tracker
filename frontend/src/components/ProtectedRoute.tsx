import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => !!state.token); // Перевіряємо, чи є токен щоб визначити чи аутентифікований користувач
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
