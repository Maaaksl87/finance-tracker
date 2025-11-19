import "./index.css";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        {/* <Layout>
          <div className="flex min-h-svh flex-col items-center justify-center">
            <h1>Hello World</h1>
          </div>
        </Layout> */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>

          {/* <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} /> */}
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
