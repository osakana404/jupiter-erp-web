class UserController {
  constructor(userService) {
    this.userService = userService; // Dependency Injection
  }

  register = async (req, res, next) => {
    try {
      const { login, password } = req.body;
      const newUser = await this.userService.createUser(login, password);
      res
        .status(201)
        .json(`Пользователь ${newUser.login} успешно зарегистрирован`);
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { login, password } = req.body;
      const result = await this.userService.login(login, password);
      res.cookie("token", result.token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // Кука проживет 24 часа
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (req, res) => {
    // middleware checkAuth положит данные юзера в req.user
    res.status(200).json({ user: req.user });
  };
}

export default UserController;
