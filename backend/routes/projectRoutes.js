const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware"); // Middleware d'authentification

// Définition des routes pour les projets (protégées par auth)
router.post("/", protect, projectController.createProject);       // Créer un projet
router.get("/", protect, projectController.getProjects);          // Récupérer tous les projets
router.get("/:id", protect, projectController.getProjectById);    // Récupérer un projet par ID
router.put("/:id", protect, projectController.updateProject);     // Modifier un projet
router.delete("/:id", protect, projectController.deleteProject);  // Supprimer un projet

module.exports = router;