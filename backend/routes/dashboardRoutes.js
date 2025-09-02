const express = require("express")
const router = express.Router()

//Définition de la route GET /dashboard
router.get("/dashboard", (req, res) => {
  // Récupération des données du tableau de bord
  const dashboardData = {
    projets,
    tâchesEnCours,
    équipes,
    tâchesTerminées,
    tâchesEnRetard,
    événementsÀVenir,
    utilisateursActifs,
  }

  //  On renvoie ces données au client (frontend) au format JSON
  res.json(dashboardData)
})

module.exports = router;
