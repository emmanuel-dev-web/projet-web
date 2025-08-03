const express = require("express");
const router = express.Router();

// Importation de la fonction loginUser depuis le contrôleur
const { loginUser } = require("../controllers/authController");

// Importation de la fonction registerUser depuis le contrôleur
const { registerUser } = require("../controllers/authController");


// Définition de la route POST /login
router.post("/login", loginUser);

// Définition de la route POST /register
router.post("/register", registerUser);


// Exportation du routeur pour utilisation dans index.js
module.exports = router;