// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Импортируем наши новые страницы
import Dashboard from "./pages/Dashboard";
import Supplies from "./pages/Supplies";
// Не забудь импортировать Layout, если мы решили оставить общее меню
import Layout from "./components/Layout";
import Parts from "./pages/Parts"; // Создадим его сейчас

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="supplies" element={<Supplies />} />

          <Route path="references">
            <Route path="parts" element={<Parts />} />
            <Route path="cars" element={<Supplies />} />
            <Route path="agents" element={<Supplies />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
