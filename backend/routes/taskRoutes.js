const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware"); 

// Définition des routes pour les tâches (protégées par auth)
router.post("/", protect, taskController.createTask);       // Créer une tâche
router.get("/", protect, taskController.getTasks);          // Récupérer toutes les tâches
router.get("/:id", protect, taskController.getTaskById);    // Récupérer une tâche par ID
router.put("/:id", protect, taskController.updateTask);     // Modifier une tâche
router.delete("/:id", protect, taskController.deleteTask);  // Supprimer une tâche

module.exports = router;
