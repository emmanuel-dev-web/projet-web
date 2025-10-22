// routes/calendarRoutes.js
const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");
const authMiddleware = require("../middleware/authMiddleware");

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// GET /api/calendar/events - Récupérer tous les événements
router.get("/events", calendarController.getAllEvents);

// GET /api/calendar/events/period - Récupérer les événements par période
router.get("/events/period", calendarController.getEventsByPeriod);

// GET /api/calendar/events/:date - Récupérer les événements pour une date spécifique
router.get("/events/:date", calendarController.getEventsByDate);

// GET /api/calendar/stats - Récupérer les statistiques du calendrier
router.get("/stats", calendarController.getCalendarStats);

// GET /api/calendar/projects - Récupérer les projets disponibles pour créer un événement
router.get("/projects", calendarController.getAvailableProjects);

// GET /api/calendar/events/:id - Récupérer un événement spécifique
router.get("/events/:id", calendarController.getEventById);

// POST /api/calendar/events - Créer un nouvel événement
router.post("/events", calendarController.createEvent);

// PUT /api/calendar/events/:id - Modifier un événement
router.put("/events/:id", calendarController.updateEvent);

// DELETE /api/calendar/events/:id - Supprimer un événement
router.delete("/events/:id", calendarController.deleteEvent);

module.exports = router;