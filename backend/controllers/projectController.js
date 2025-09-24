const Project = require("../models/project");

// Créer un projet
exports.createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      user: req.user._id, // Ajoute l'utilisateur connecté
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: "Erreur création projet", details: err });
  }
};

// Récupérer tous les projets de l'utilisateur connecté
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err });
  }
};

// Récupérer un projet par ID (seulement si c'est le sien)
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ message: "Projet non trouvé" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération projet", error: err });
  }
};

// Modifier un projet (seulement si c'est le sien)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Projet non trouvé" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: "Erreur modification projet", error: err });
  }
};

// Supprimer un projet (seulement si c'est le sien)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ message: "Projet non trouvé ou non autorisé" });
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression projet", error: err });
  }
};