// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Импортируем наши новые страницы
import Dashboard from "./pages/Dashboard";
import Supplies from "./pages/Supplies";
import References from "./pages/References";
// Не забудь импортировать Layout, если мы решили оставить общее меню
import Layout from "./components/Layout";
import ReferenceDetail from "./pages/ReferenceDetail"; // Создадим его сейчас

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="supplies" element={<Supplies />} />

          <Route path="references">
            <Route index element={<References />} />{" "}
            {/* Список всех справочников */}
            <Route path=":type" element={<ReferenceDetail />} />{" "}
            {/* Один файл для всех */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
