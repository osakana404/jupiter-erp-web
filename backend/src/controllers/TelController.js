class TelController {
  constructor(telService) {
    this.telService = telService;
  }

  show = async (req, res, next) => {
    try {
      const result = await this.telService.showAllContacts();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const {
        name,
        position,
        internal_tel,
        city_tel,
        mobile_tel,
        department_id,
      } = req.body;
      if (!name || !department_id) {
        return res.status(400).json({ message: `Заполните все поля` });
      }
      const result = await this.telService.createContact(
        name,
        position,
        internal_tel,
        city_tel,
        mobile_tel,
        department_id,
      );
      res
        .status(201)
        .json({ message: `Контакт ${result.name} успешно добавлен` });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: `Передайте ID в параметрах!` });
      }
      await this.telService.deleteContact(id);
      res.status(200).json({ message: `Контакт с ${id} удален!` });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params; // кого
      const {
        name,
        position,
        internal_tel,
        city_tel,
        mobile_tel,
        department_id,
      } = req.body; // данные для обновления

      if (!id) {
        return res.status(400).json({ message: "ID не указан" });
      }
      const result = await this.telService.updateContact(id, {
        name,
        position,
        internal_tel,
        city_tel,
        mobile_tel,
        department_id,
      });
      res.status(200).json({ message: "Контакт обновлен", result });
    } catch (error) {
      next(error);
    }
  };
}

export default TelController;
