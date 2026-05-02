import { useEffect, useState } from "react";
import TextHead from "../components/TextHead";

export default function RepairView() {
  const repairData = [
    {
      id: 1,
      fio: "Васильев Павел Николаевич",
      auto: "Toyota Premio 2007",
      number: "Т918НЕ14",
      tel: "+79148282046",
      passport: "9781 1414512",
      createdAt: "30.04.2026",
    },
    {
      id: 2,
      fio: "Сидоров Сидр Сидорович",
      auto: "Toyota Premio 2007",
      number: "Т918НЕ14",
      tel: "+79148282046",
      passport: "9781 1414512",
      createdAt: "01.05.2026",
    },
    {
      id: 3,
      fio: "Петров Иван Иванович",
      auto: "Toyota Premio 2007",
      number: "Т918НЕ14",
      tel: "+79148282046",
      passport: "9781 1414512",
      createdAt: "02.05.2026",
    },
  ];
  const priceData = [
    {
      id: 1,
      name: "замена гранат",
      description: "быстро и качественно продиагностируем и заменим гранаты",
      price: 15000,
      updatedAt: "02.05.2026",
    },
    {
      id: 2,
      name: "диагностика авто",
      description: "продиагностируем",
      price: 500,
      updatedAt: "02.05.2026",
    },
    {
      id: 3,
      name: "замена прокладки ГБЦ",
      description: " качественно продиагностируем и заменим прокладку ГБЦ",
      price: 15500,
      updatedAt: "02.05.2026",
    },
  ];
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showBetaWarning, setShowBetaWarning] = useState(true);

  const filteredRepairData = repairData?.filter((data) =>
    data.fio?.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );

  useEffect(() => {
    console.log("effect", showModal);
  }, [showModal]); // при изменении showModal

  useEffect(() => {}, []); // при монтировании

  return (
    <>
      {showBetaWarning && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 9999,
            }}
            onClick={() => setShowBetaWarning(false)}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              zIndex: 10000,
              textAlign: "center",
            }}
          >
            <h2>⚠️ ЭТО БЕТА ВЕРСИЯ</h2>
            <p>Некоторые функции могут работать нестабильно</p>
            <button onClick={() => setShowBetaWarning(false)}>
              Понятно, продолжить
            </button>
          </div>
        </>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <TextHead title="СТО" text="частный ремонт авто" />
        </div>

        <input
          type="search"
          placeholder="Найти ФИО..."
          style={{ maxHeight: "30px" }}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "row",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => {
            setShowModal(true);
          }}
        >
          Открыть прайс
        </button>
        <button>Оформить заявку на ремонт</button>
      </div>

      <div>
        <h1>Последние договора:</h1>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>ФИО</th>
              <th>Авто</th>
              <th>Гос.номер</th>
              <th>Телефон</th>
              <th>Пасспорт</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            {repairData && repairData.length > 0 ? (
              filteredRepairData.map((element) => (
                <tr key={element.id}>
                  <td>{element.id}</td>
                  <td>{element.fio}</td>
                  <td>{element.auto}</td>
                  <td>{element.number}</td>
                  <td>{element.tel}</td>
                  <td>{element.passport}</td>
                  <td>{element.createdAt}</td>
                </tr>
              ))
            ) : (
              <p style={{ marginTop: "1rem", color: "#888" }}>No data</p>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 999,
            }}
            onClick={() => setShowModal(false)} // Клик по фону закрывает модалку
          />

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "20px",
              zIndex: 1000,
            }}
          >
            <TextHead title="Текущий прайс" text="Актуальный прайс ССМП" />
            {
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Услуга</th>
                      <th>Описание</th>
                      <th>Цена</th>
                      <th>Изменено</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceData && priceData.length > 0 ? (
                      priceData.map((element) => (
                        <tr key={element.id}>
                          <td>{element.id}</td>
                          <td>{element.name}</td>
                          <td>{element.description}</td>
                          <td>{element.price}</td>
                          <td>{element.updatedAt}</td>
                        </tr>
                      ))
                    ) : (
                      <p style={{ marginTop: "1rem", color: "#888" }}>
                        No data
                      </p>
                    )}
                  </tbody>
                </table>
              </div>
            }
            <button onClick={() => setShowModal(false)}>Закрыть</button>
          </div>
        </>
      )}
    </>
  );
}
