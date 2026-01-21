import "./index.css";
//pages and components
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import Transactions from "./pages/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import TestSourcesPage from "./pages/TestSourcePage";
import StatsPage from "./pages/StatsPage";
import AuthPage from "./components/auth/AuthPage";

//providers and routers
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          //TODO: переглянути всі компоненти та за потреби оптимізувати
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/sources" element={<TestSourcesPage />} /> //TODO:виправити на SourcesPage
              <Route path="/stats" element={<StatsPage />} /> //TODO: покращити UI та зарефакторити логіку StatsPage
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
