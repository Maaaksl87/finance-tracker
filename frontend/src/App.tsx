import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Всі маршрути, які мають мати Sidebar, 
            будуть обгорнуті в 'Layout' */}
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
        </Route>

        {/* сторінки без Layout */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
