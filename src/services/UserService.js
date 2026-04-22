import "dotenv/config";
import bcrypt from "bcrypt";
import models from "../models/index.cjs";
import jwt from "jsonwebtoken";
const { Category, Part, User } = models;

class UserService {
  async createUser(login, password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      login: login,
      password: hashedPassword,
    });
    return newUser;
  }

  async login(login, password) {
    try {
      const user = await User.findOne({ where: { login: login } });
      if (!user) {
        throw new Error("Неверный логин или пароль");
      }
      const compare = await bcrypt.compare(password, user.password);

      if (!compare) {
        throw new Error("Неверный логин или пароль");
      }
      const token = jwt.sign(
        { id: user.id, login: user.login, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      return {
        token,
        user: {
          id: user.id,
          login: user.login,
          role: user.role,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
