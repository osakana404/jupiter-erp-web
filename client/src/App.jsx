import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Parts from "./pages/Parts";
import Cars from "./pages/Cars";
import Agents from "./pages/Agents";
import Supplies from "./pages/Supplies";
import Batches from "./pages/Batches";
import DisburseView from "./pages/DisburseView";
import TransactionView from "./pages/TransactionView";
import DashboardView from "./pages/DashboardView";
import RepairView from "./pages/RepairView";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Все внутренние страницы оборачиваем в ProtectedRoute */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardView />} />
            <Route path="supplies" element={<Supplies />} />{" "}
            <Route path="disburse" element={<DisburseView />} />{" "}
            <Route path="batches" element={<Batches />} />{" "}
            <Route path="transactions" element={<TransactionView />} />{" "}
            <Route path="repair" element={<RepairView />} />{" "}
            {/* ПУТЬ ДЛЯ НАКЛАДНЫХ */}
            <Route path="references/parts" element={<Parts />} />
            <Route path="references/category" element={<Categories />} />
            <Route path="references/cars" element={<Cars />} />
            <Route path="references/agents" element={<Agents />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
