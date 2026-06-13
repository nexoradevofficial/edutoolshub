import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";
import { scheduleAnalytics } from "./utils/analytics.js";
import { scheduleAppReveal } from "./utils/revealApp.js";

const rootEl = document.getElementById("root");
const app = (
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);

const hasPrerenderedMarkup =
  rootEl &&
  rootEl.childNodes.length > 0 &&
  rootEl.querySelector("header, main, section, nav");

if (hasPrerenderedMarkup) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}

scheduleAppReveal();
scheduleAnalytics();
