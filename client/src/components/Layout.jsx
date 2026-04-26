import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Боковое меню (Sidebar) */}
      <aside
        style={{
          width: "250px",
          background: "#2c3e50",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          📦 ERP System
        </h2>

        <Link to="/" style={navLinkStyle}>
          📊 Дашборд
        </Link>
        <Link to="/supplies" style={navLinkStyle}>
          🚚 Накладные
        </Link>
        <Link to="/references" style={navLinkStyle}>
          📑 Справочники
        </Link>

        <div style={{ marginTop: "auto", fontSize: "0.8rem", opacity: 0.7 }}>
          v1.0.0 (Sequelize + SQLite)
        </div>
      </aside>

      {/* Основная область контента */}
      <main style={{ flex: 1, padding: "20px", background: "#f4f7f6" }}>
        <Outlet />
      </main>
    </div>
  );
}

// Простые стили для ссылок
const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "4px",
  transition: "background 0.2s",
  display: "block",
};
