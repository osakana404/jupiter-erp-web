import "dotenv/config";
import jwt from "jsonwebtoken";

export function checkAuth(req, res, next) {
  //jwt.verify
  const authHeader = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Пользователь не авторизован" });
  }

  try {
    // 2. Расшифровываем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Сохраняем данные в объект запроса
    req.user = decoded;

    next(); // Идем дальше к следующему Middleware или контроллеру
  } catch (e) {
    next(e);
  }
}
