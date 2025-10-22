// controllers/calendarController.js
const Task = require("../models/task");
const Project = require("../models/project");
const Team = require("../models/teams");
const Event = require("../models/event");

// Couleurs selon le statut des événements
const getEventColor = (status) => {
  switch (status) {
    case "planifie": return "bg-blue-500";
    case "en_cours": return "bg-orange-500";
    case "termine": return "bg-green-500";
    case "annule": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

// Couleurs selon le statut des tâches
const getTaskColor = (status) => {
  switch (status) {
    case "a_faire": return "bg-blue-500";
    case "en_cours": return "bg-yellow-500";
    case "termine": return "bg-green-500";
    default: return "bg-gray-500";
  }
};

// Couleurs selon le statut des projets
const getProjectColor = (status) => {
  switch (status) {
    case "en_cours": return "bg-indigo-500";
    case "termine": return "bg-green-600";
    case "en_attente": return "bg-orange-500";
    default: return "bg-gray-600";
  }
};

// Récupérer tous les événements du calendrier
exports.getAllEvents = async (req, res) => {
  try {
    const userId = req.user._id;

    // Nettoyer automatiquement les événements expirés
    await Event.removeExpiredEvents();

    // Récupérer toutes les données en parallèle
    const [tasks, projects, teams, events] = await Promise.all([
      Task.find({ user: userId }),
      Project.find({ user: userId }),
      Team.find({ user: userId }),
      Event.find({ user: userId }).populate('projectId')
    ]);

    // Combiner toutes les données en événements calendrier
    const calendarEvents = [];

    // Ajouter les tâches avec deadline
    tasks.forEach(task => {
      if (task.deadline) {
        calendarEvents.push({
          id: `task-${task._id}`,
          title: task.title,
          date: task.deadline,
          type: "task",
          status: task.status,
          color: getTaskColor(task.status),
          data: task
        });
      }
    });

    // Ajouter les projets avec deadline
    projects.forEach(project => {
      if (project.deadline) {
        calendarEvents.push({
          id: `project-${project._id}`,
          title: project.title,
          date: project.deadline,
          type: "project",
          status: project.status,
          color: getProjectColor(project.status),
          data: project
        });
      }
    });

    // Ajouter les équipes (date de création)
    teams.forEach(team => {
      calendarEvents.push({
        id: `team-${team._id}`,
        title: `Équipe: ${team.name}`,
        date: team.createdAt,
        type: "team",
        color: "bg-purple-500",
        data: team
      });
    });

    // Ajouter les événements personnalisés
    events.forEach(event => {
      calendarEvents.push({
        id: `event-${event._id}`,
        title: event.title,
        date: event.date,
        type: "event",
        status: event.status,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description,
        color: getEventColor(event.status),
        isCompleted: event.isCompleted,
        projectTitle: event.projectId ? event.projectId.title : 'Projet supprimé',
        projectId: event.projectId ? event.projectId._id : null,
        data: event
      });
    });

    // Trier les événements par date
    calendarEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      success: true,
      events: calendarEvents,
      total: calendarEvents.length
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la récupération des événements",
      error: error.message 
    });
  }
};

// Récupérer les événements pour une période spécifique
exports.getEventsByPeriod = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Les dates de début et de fin sont requises"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Fin de journée

    // Récupérer les données filtrées par période
    const [tasks, projects, teams] = await Promise.all([
      Task.find({ 
        user: userId,
        deadline: { $gte: start, $lte: end }
      }),
      Project.find({ 
        user: userId,
        deadline: { $gte: start, $lte: end }
      }),
      Team.find({ 
        user: userId,
        createdAt: { $gte: start, $lte: end }
      })
    ]);

    // Combiner en événements
    const calendarEvents = [];

    tasks.forEach(task => {
      calendarEvents.push({
        id: `task-${task._id}`,
        title: task.title,
        date: task.deadline,
        type: "task",
        status: task.status,
        color: getTaskColor(task.status),
        data: task
      });
    });

    projects.forEach(project => {
      calendarEvents.push({
        id: `project-${project._id}`,
        title: project.title,
        date: project.deadline,
        type: "project",
        status: project.status,
        color: getProjectColor(project.status),
        data: project
      });
    });

    teams.forEach(team => {
      calendarEvents.push({
        id: `team-${team._id}`,
        title: `Équipe: ${team.name}`,
        date: team.createdAt,
        type: "team",
        color: "bg-purple-500",
        data: team
      });
    });

    // Trier par date
    calendarEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      success: true,
      events: calendarEvents,
      period: { startDate, endDate },
      total: calendarEvents.length
    });

  } catch (error) {
    console.error("Erreur lors de la récupération par période:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la récupération des événements",
      error: error.message 
    });
  }
};

// Récupérer les statistiques du calendrier
exports.getCalendarStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Compter les différents types d'événements
    const [taskCount, projectCount, teamCount] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Project.countDocuments({ user: userId }),
      Team.countDocuments({ user: userId })
    ]);

    // Statistiques par statut pour les tâches
    const taskStats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Statistiques par statut pour les projets
    const projectStats = await Project.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Événements à venir (7 prochains jours)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingTasks = await Task.countDocuments({
      user: userId,
      deadline: { $gte: new Date(), $lte: nextWeek }
    });

    const upcomingProjects = await Project.countDocuments({
      user: userId,
      deadline: { $gte: new Date(), $lte: nextWeek }
    });

    res.status(200).json({
      success: true,
      stats: {
        totals: {
          tasks: taskCount,
          projects: projectCount,
          teams: teamCount,
          total: taskCount + projectCount + teamCount
        },
        tasksByStatus: taskStats,
        projectsByStatus: projectStats,
        upcoming: {
          tasks: upcomingTasks,
          projects: upcomingProjects,
          total: upcomingTasks + upcomingProjects
        }
      }
    });

  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors du calcul des statistiques",
      error: error.message 
    });
  }
};

// Récupérer les événements pour une date spécifique
exports.getEventsByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "La date est requise"
      });
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Récupérer les événements pour cette date
    const [tasks, projects, teams] = await Promise.all([
      Task.find({ 
        user: userId,
        deadline: { $gte: startOfDay, $lte: endOfDay }
      }),
      Project.find({ 
        user: userId,
        deadline: { $gte: startOfDay, $lte: endOfDay }
      }),
      Team.find({ 
        user: userId,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      })
    ]);

    // Combiner en événements
    const dayEvents = [];

    tasks.forEach(task => {
      dayEvents.push({
        id: `task-${task._id}`,
        title: task.title,
        date: task.deadline,
        type: "task",
        status: task.status,
        color: getTaskColor(task.status),
        data: task
      });
    });

    projects.forEach(project => {
      dayEvents.push({
        id: `project-${project._id}`,
        title: project.title,
        date: project.deadline,
        type: "project",
        status: project.status,
        color: getProjectColor(project.status),
        data: project
      });
    });

    teams.forEach(team => {
      dayEvents.push({
        id: `team-${team._id}`,
        title: `Équipe: ${team.name}`,
        date: team.createdAt,
        type: "team",
        color: "bg-purple-500",
        data: team
      });
    });

    res.status(200).json({
      success: true,
      date: date,
      events: dayEvents,
      total: dayEvents.length
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des événements du jour:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la récupération des événements",
      error: error.message 
    });
  }
};

// Récupérer les projets disponibles pour créer un événement
exports.getAvailableProjects = async (req, res) => {
  try {
    console.log("🔍 API getAvailableProjects appelée");
    const userId = req.user._id;
    console.log("👤 UserId:", userId);

    const projects = await Project.find({ 
      user: userId,
      status: { $ne: "termine" } // Exclure les projets terminés
    }).select('_id title description status createdAt');

    console.log("📋 Projets trouvés:", projects.length);
    console.log("📄 Détails projets:", projects);

    res.status(200).json({
      success: true,
      projects: projects,
      total: projects.length
    });

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des projets:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la récupération des projets",
      error: error.message 
    });
  }
};

// Créer un nouvel événement
exports.createEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, date, startTime, endTime, projectId, status } = req.body;

    // Vérifier que le projet existe et appartient à l'utilisateur
    const project = await Project.findOne({ _id: projectId, user: userId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé"
      });
    }

    const event = new Event({
      title,
      description,
      date,
      startTime: startTime || "09:00",
      endTime: endTime || "10:00",
      status: status || "planifie",
      projectId,
      user: userId
    });

    await event.save();
    
    // Peupler les informations du projet pour la réponse
    await event.populate('projectId', 'title');

    res.status(201).json({
      success: true,
      event: event,
      message: "Événement créé avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    res.status(400).json({ 
      success: false,
      message: "Erreur lors de la création de l'événement",
      error: error.message 
    });
  }
};

// Modifier un événement
exports.updateEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.id;
    const updates = req.body;

    const event = await Event.findOneAndUpdate(
      { _id: eventId, user: userId },
      updates,
      { new: true, runValidators: true }
    ).populate('projectId', 'title');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé"
      });
    }

    res.status(200).json({
      success: true,
      event: event,
      message: "Événement modifié avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la modification de l'événement:", error);
    res.status(400).json({ 
      success: false,
      message: "Erreur lors de la modification de l'événement",
      error: error.message 
    });
  }
};

// Supprimer un événement
exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.id;

    const event = await Event.findOneAndDelete({ _id: eventId, user: userId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé"
      });
    }

    res.status(200).json({
      success: true,
      message: "Événement supprimé avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la suppression de l'événement",
      error: error.message 
    });
  }
};

// Récupérer un événement spécifique
exports.getEventById = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.id;

    const event = await Event.findOne({ _id: eventId, user: userId })
      .populate('projectId', 'title status');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé"
      });
    }

    res.status(200).json({
      success: true,
      event: event
    });

  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la récupération de l'événement",
      error: error.message 
    });
  }
};
