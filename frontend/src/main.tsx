// frontend/src/main.tsx (ПІСЛЯ)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// Імпортуємо головний CSS файл (Vite вже створив його)
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);