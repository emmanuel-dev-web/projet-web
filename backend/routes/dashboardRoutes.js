const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")

// Importer les modèles
const Project = require("../models/project")
const Task = require("../models/task")
const Team = require("../models/teams")

//Définition de la route GET /dashboard avec authentification
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer les données réelles depuis la base de données
    const [projects, tasks, teams] = await Promise.all([
      Project.find({ user: userId }),
      Task.find({ user: userId }),
      Team.find({ user: userId })
    ]);

    // Calculer les statistiques
    const tâchesEnCours = tasks.filter(task => task.status === "en cours").length;
    const tâchesTerminées = tasks.filter(task => task.status === "terminé").length;
    
    // Calculer les tâches en retard
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tâchesEnRetard = tasks.filter(task => {
      if (!task.deadline || task.status === "terminé") return false;
      const deadline = new Date(task.deadline);
      deadline.setHours(0, 0, 0, 0);
      return deadline < today;
    }).length;

    const dashboardData = {
      projets: projects.length,
      tâchesEnCours,
      équipes: teams.length,
      tâchesTerminées,
      tâchesEnRetard,
      événementsÀVenir: [],
      utilisateursActifs: 1,
    }

    //  On renvoie ces données au client (frontend) au format JSON
    res.json(dashboardData)
  } catch (error) {
    console.error("Erreur lors de la récupération des données dashboard:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
})

module.exports = router;
