import "./index.css";
//pages and components
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import Transactions from "./pages/Transactions";
import LoginTest from "./pages/LoginTest";
// import LoginPage from "./pages/loginPage";
import ProtectedRoute from "./components/ProtectedRoute";

//providers and routers
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<LoginTest />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="transactions" element={<Transactions />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
