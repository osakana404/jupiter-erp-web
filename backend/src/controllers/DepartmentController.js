class DepartmentController {
  constructor(departmentService) {
    this.departmentService = departmentService;
  }

  show = async (req, res, next) => {
    try {
      const result = await this.departmentService.showAllDepartments();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Не передано поле name" });
      }
      const result = await this.departmentService.createDepartment(name);
      return res
        .status(201)
        .json({ message: `Отдел ${name} успешно создан!`, result });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!id || !name) {
        return res.status(400).json({ message: "ID и новое имя обязательны" });
      }

      const result = await this.departmentService.updateDepartment(id, name);
      return res
        .status(200)
        .json({ message: "Отдел успешно обновлен", result });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.departmentService.deleteDepartment(id);
      return res.status(200).json({ message: `Отдел успешно удален` });
    } catch (error) {
      next(error);
    }
  };
}

export default DepartmentController;
