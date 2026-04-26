import { Link } from "react-router-dom";

export default function References() {
  const list = [
    { id: "parts", name: "Запчасти" },
    { id: "cars", name: "Автомобили" },
    { id: "agents", name: "Контрагенты" },
    // ...
  ];

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
    >
      {list.map((item) => (
        <Link
          key={item.id}
          to={`/references/${item.id}`}
          style={{
            padding: "20px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
