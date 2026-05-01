import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";

// Configure axios base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://psychology-backend-alpha.vercel.app";
axios.defaults.baseURL = API_BASE_URL;

// Add token to requests if available
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" />
  </React.StrictMode>,
);
