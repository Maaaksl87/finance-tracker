import "./index.css";
//pages and components
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import LoginTest from "./pages/LoginTest";
import LoginPage from "./pages/loginPage";

//providers and routers
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Navigate } from "react-router-dom";

// Компонент для захищених маршрутів
const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
  const isAuth = useAuthStore((state) => state.isAuth);
  return isAuth ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<LoginTest />} />
          <Route path="/" element={<PrivateRoute element={<Layout />} />}>  {/* Захищений маршрут */}
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
