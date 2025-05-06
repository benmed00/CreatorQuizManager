import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./lib/theme-provider";
// Import i18n initialization (this will setup i18n instance)
import i18n from "./lib/i18n";
import { I18nextProvider } from "react-i18next";

// No need for a loading component since we're bundling translations and not using suspense

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
