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
import { RegisterForm } from "./components/auth/RegisterForm";
import { LoginForm } from "./components/auth/LoginForm";
import SavingPlansPage from "./pages/SavingPlansPage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>
          //TODO: переглянути всі компоненти та за потреби оптимізувати
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route
                path="/"
                element={<DashboardPage />}
                handle={{ title: "Головна" }}
              />
              <Route
                path="/transactions"
                element={<Transactions />}
                handle={{ title: "Транзакції" }}
              />
              <Route
                path="/sources"
                element={<TestSourcesPage />}
                handle={{ title: "Джерела" }}
              />{" "}
              //TODO:виправити на SourcesPage
              <Route
                path="/stats"
                element={<StatsPage />}
                handle={{ title: "Статистика" }}
              />{" "}
              //TODO: покращити UI та зарефакторити логіку StatsPage
              <Route
                path="/saving-plans"
                element={<SavingPlansPage />}
                handle={{ title: "Плани заощаджень" }}
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
