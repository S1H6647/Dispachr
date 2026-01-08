import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./main.css";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./hooks/useTheme.jsx";

createRoot(document.getElementById("root")).render(
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <ThemeProvider>
            <App />
            <Toaster />
        </ThemeProvider>
    </CookiesProvider>
);

