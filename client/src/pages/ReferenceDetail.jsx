import { useParams, Link } from "react-router-dom";

export default function ReferenceDetail() {
  // Получаем :type из URL (например, "parts" или "cars")
  const { type } = useParams();

  // Словарь для красивых заголовков
  const titles = {
    parts: "⚙️ Справочник запчастей",
    cars: "🚗 Справочник автомобилей",
    agents: "🤝 Контрагенты",
    categories: "📂 Категории",
    users: "👤 Пользователи",
  };

  return (
    <div>
      <Link
        to="/references"
        style={{ color: "#3498db", textDecoration: "none" }}
      >
        ← Назад к списку
      </Link>
      <hr />
      <h1>{titles[type] || "Неизвестный справочник"}</h1>

      <div
        style={{
          padding: "20px",
          border: "1px dashed #ccc",
          borderRadius: "8px",
          background: "white",
        }}
      >
        <p>
          Здесь скоро будет таблица с данными для <strong>{type}</strong> из
          вашей базы SQLite.
        </p>
        {/* Сюда мы позже подключим TanStack Table и данные из API */}
      </div>
    </div>
  );
}
