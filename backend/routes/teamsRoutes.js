const express = require("express");
const router = express.Router();
const {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/teamsController");
const authMiddleware = require("../middleware/authMiddleware");

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

// GET /api/teams - Récupérer toutes les équipes de l'utilisateur connecté
router.get("/", getTeams);

// GET /api/teams/:id - Récupérer une équipe spécifique par ID
router.get("/:id", getTeamById);

// POST /api/teams - Créer une nouvelle équipe
router.post("/", createTeam);

// PUT /api/teams/:id - Modifier une équipe existante
router.put("/:id", updateTeam);

// DELETE /api/teams/:id - Supprimer une équipe
router.delete("/:id", deleteTeam);

module.exports = router;
