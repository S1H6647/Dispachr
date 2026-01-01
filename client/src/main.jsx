import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./main.css";
import { CookiesProvider } from "react-cookie";

createRoot(document.getElementById("root")).render(
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <App />
    </CookiesProvider>
);

