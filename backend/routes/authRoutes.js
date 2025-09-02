const express = require("express");
const router = express.Router();

// Importation de la fonction loginUser depuis le contrôleur
const { loginUser } = require("../controllers/authController");

// Importation de la fonction registerUser depuis le contrôleur
const { registerUser } = require("../controllers/authController");

// Importationd e la foction forgot-password depuis le controller
const { forgotPassword} = require("../controllers/authController");

// Importation de la fonction resetPassword depuis le controller
const { resetPassword} = require("../controllers/authController");

// Importation de la fonction getCurrentUser depuis le contrôleur
const { getCurrentUser } = require("../controllers/authController");

// Définition de la route POST /login
router.post("/login", loginUser);

// Définition de la route POST /register
router.post("/register", registerUser);

// Définition de la route POST /forgot-password
router.post("/forgot-password",forgotPassword);

// Définition de la route POST /reset-password avec token
router.post('/reset-password/:token', resetPassword);

// Définition de la route GET /user/me
router.get("/user/me", getCurrentUser);

// Exportation du routeur pour utilisation dans index.js
module.exports = router;