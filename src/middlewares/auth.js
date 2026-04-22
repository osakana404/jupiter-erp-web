import jwt from "jsonwebtoken";

export function checkAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Пользователь не авторизован" });
  }

  try {
    // 2. Расшифровываем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Сохраняем данные в объект запроса
    req.user = decoded;

    next(); // Идем дальше к следующему Middleware или контроллеру
  } catch (error) {
    next(error);
  }
}
// rrouter.post('/article', checkAuth, checkRole(['admin', 'editor']), ...) — для админов и редакторов.
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // 1. Проверяем, есть ли данные из токена
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    // 2. Проверяем, входит ли роль пользователя в список разрешенных
    if (allowedRoles.includes(req.user.role)) {
      next(); // Всё отлично, пропускаем
    } else {
      res.status(403).json({ message: "Нет доступа: недостаточно прав" });
    }
  };
};
