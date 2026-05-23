import { createContext, useContext, useState, useEffect } from "react";
import { Loader, Center } from "@mantine/core";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверка сессии при первой загрузке (нужно добавить эндпоинт /me на бэкенд)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        console.error("Не авторизован");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  if (loading)
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
