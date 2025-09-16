// controllers/taskController.js
const Task = require("../models/task");

//  Créer une nouvelle tâche
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      deadline: req.body.deadline,
      user: req.user._id, 
    }); // récupère ce que le frontend a envoyé
    await task.save(); // enregistre dans MongoDB
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
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json({ message: "Tâche supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
