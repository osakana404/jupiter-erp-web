import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { MantineProvider, createTheme } from "@mantine/core"; // Импорт Mantine
import "@mantine/core/styles.css"; // ОБЯЗАТЕЛЬНО: базовые стили
import "./index.css";

const queryClient = new QueryClient();
const theme = createTheme({
  /** Здесь можно будет настроить цвета ERP позже */
  primaryColor: "blue",
  headings: {
    fontFamily: "Greycliff CF, sans-serif",
    textWrap: "pretty",
    sizes: {
      h1: { fontSize: "2rem", fontWeight: "900" },
    },
  },

  focusRing: "auto",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
);
