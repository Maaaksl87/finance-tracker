import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import { Button } from "@/components/ui/button"
import "./index.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
      
//         <Route element={<Layout />}>
//           <Route path="/" element={<DashboardPage />} />
//           <Route path="/transactions" element={<TransactionsPage />} />
//         </Route>

       
//       </Routes>
//     </BrowserRouter>
//   );
// }



function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
  )
}

export default App;
