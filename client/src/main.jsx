import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { MantineProvider, createTheme } from "@mantine/core"; // Импорт Mantine
import "@mantine/core/styles.css"; // ОБЯЗАТЕЛЬНО: базовые стили
import "@mantine/dates/styles.css"; // ДОБАВЬ ЭТУ СТРОКУ
import "dayjs/locale/ru";
import "./index.css";

const queryClient = new QueryClient();
const theme = createTheme({
  /** Здесь можно будет настроить цвета ERP позже */
  primaryColor: "blue",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "700",
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
