const Employee = require('../model/employee');

exports.getAllEmployees = async (req, res) => {
    const employees = await Employee.findAll();
    res.json(employees);
};

exports.getEmployeeById = async (req, res) => {
    const employee = await Employee.findByPk(req.params.id);
    res.json(employee);
};

exports.createEmployee = async (req, res) => {
    const employee = await Employee.create(req.body);
    res.json(employee);
};

exports.updateEmployee = async (req, res) => {
    const employee = await Employee.findByPk(req.params.id);
    await employee.update(req.body);
    res.json(employee);
};

exports.deleteEmployee = async (req, res) => {
    const employee = await Employee.findByPk(req.params.id);
    await employee.destroy();
    res.json({ message: 'Employee deleted' });
};

exports.restoreEmployee = async (req, res) => {
    // Encuentra el empleado eliminado suavemente
    const employee = await Employee.findOne({ where: { id: req.params.id }, paranoid: false });

    // Si el empleado no existe o no fue eliminado suavemente, envía un error
    if (!employee || !employee.deletedAt) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    // Restaura el empleado
    await employee.restore();

    res.json({ message: 'Employee restored', employee });
};