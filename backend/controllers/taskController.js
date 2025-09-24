// controllers/taskController.js
const Task = require("../models/task");
const Project = require("../models/project");

//  Créer une nouvelle tâche
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      deadline: req.body.deadline,
      user: req.user._id, 
      projectId: req.body.projectId
    }); // récupère ce que le frontend a envoyé
    await task.save(); // enregistre dans MongoDB
    await Project.findByIdAndUpdate(
      req.body.projectId,
      { $inc: { tasks: 1 } }
    );
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Récupérer toutes les tâches
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une tâche par ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    await Project.findByIdAndUpdate(
      task.projectId,
      { $inc: { tasks: -1 } }
    );
    res.json({ message: "Tâche supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
