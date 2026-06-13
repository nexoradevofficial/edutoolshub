import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";
import { scheduleAnalytics } from "./utils/analytics.js";
import { scheduleFontLoad } from "./utils/loadFonts.js";

scheduleFontLoad();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);

scheduleAnalytics();
