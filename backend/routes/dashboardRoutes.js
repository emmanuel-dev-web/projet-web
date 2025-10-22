const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")

// Importer les modèles
const Project = require("../models/project")
const Task = require("../models/task")
const Team = require("../models/teams")
const Event = require("../models/event")

//Définition de la route GET /dashboard avec authentification
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer les données réelles depuis la base de données
    const [projects, tasks, teams, events] = await Promise.all([
      Project.find({ user: userId }),
      Task.find({ user: userId }),
      Team.find({ user: userId }),
      Event.find({ user: userId })
    ]);

    // Calculer les statistiques (inclure tâches ET événements)
    const tasksEnCours = tasks.filter(task => task.status === "en_cours").length;
    const eventsEnCours = events.filter(event => event.status === "en_cours").length;
    const tâchesEnCours = tasksEnCours + eventsEnCours;
    
    const tasksTerminées = tasks.filter(task => task.status === "termine").length;
    const eventsTerminées = events.filter(event => event.status === "termine").length;
    const tâchesTerminées = tasksTerminées + eventsTerminées;
    
    // Calculer les tâches en retard (inclure tâches ET événements)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasksEnRetard = tasks.filter(task => {
      if (!task.deadline || task.status === "termine") return false;
      const deadline = new Date(task.deadline);
      deadline.setHours(0, 0, 0, 0);
      return deadline < today;
    }).length;
    
    const eventsEnRetard = events.filter(event => {
      if (!event.date || event.status === "termine") return false;
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < today;
    }).length;
    
    const tâchesEnRetard = tasksEnRetard + eventsEnRetard;
    
    // Calculer les événements à venir (7 prochains jours)
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const événementsÀVenir = events.filter(event => {
      if (event.status === "annule") return false;
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today && eventDate <= nextWeek;
    }).length;

    const dashboardData = {
      projets: projects.length,
      tâchesEnCours,
      équipes: teams.length,
      tâchesTerminées,
      tâchesEnRetard,
      événementsÀVenir,
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
