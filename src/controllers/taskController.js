const Task = require('../models/taskModel');
const { taskValidation } = require('../utils/validate');
const logger = require('../utils/logger');

const createTask = async (req, res) => {
  // Validate the task data before creating
  const { error } = taskValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    tenantId: req.user.tenantId
  });

  try {
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ tenantId: req.user.tenantId });
    res.status(200).json(tasks);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateTask = async (req, res) => {
  // Validate the task data before updating
  const { error } = taskValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
