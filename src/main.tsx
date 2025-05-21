import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import "@/assets/font-awesome/css/all.min.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer />
    <App />
  </StrictMode>
);
