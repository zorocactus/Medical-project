import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";
import AppRouter from "./router/AppRouter";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <AppRouter />
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);