const utilisateurs = require("../models/utilisateurs");

// Appeler la fonction de génération de Token présent dans utils
const generateToken = require('../utils/generateToken');

// Appel de la fonction sendEmails présentdans utils
const sendEmail = require('../utils/sendEmails')

// Appeler la fonction de hashage de mot de passe
const bcrypt = require('bcryptjs');

// Importer jwt pour la génération et vérification du token
const jwt = require('jsonwebtoken');

//Fonction de connexion qui est appelée quand un utilisateur tente de se connecter 
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Tentative de connexion avec :", email, password);

  try {
    const utilisateur = await utilisateurs.findOne({ email });
    if (!utilisateur) {
      console.log("Aucun utilisateur trouvé pour cet email");
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    console.log("Utilisateur trouvé :", utilisateur.email);
    console.log("Mot de passe reçu :", password);
    console.log("Hash en base :", utilisateur.password);

    const isMatch = await bcrypt.compare(password, utilisateur.password);
    console.log("Résultat comparaison bcrypt :", isMatch);

    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    // ici on va générer le token
    const token = generateToken(utilisateur._id);

    res.status(200).json({
      message: "Connexion réussie",
      utilisateur: {
        _id: utilisateur._id,
        name: utilisateur.name,
        email: utilisateur.email,
      },
      token, // Le token JWT généré
    });
  } catch (error) {
    console.error("Erreur de connexion :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction d'inscription
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log("Requête reçue avec :", req.body);

    const existingUser = await utilisateurs.findOne({ email });
    if (existingUser) {
      console.log("Email déjà utilisé");
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const newUser = new utilisateurs({
      name,
      email,
      password: password,
    });

    await newUser.save();
    console.log("Nouvel utilisateur sauvegardé");

    //génération du token après inscription
    const newToken = generateToken(newUser._id);

    return res.status(201).json({
      message: "Utilisateur enregistré avec succès !",
      utilisateur: {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  },
      newToken,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

// Fonction mot de passe oublié
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("Tentative de réinitialisation avec :", email);

  // ici on verifie si l'utilisateur existe en bdd si oui on genere un token
  try {
    const utilisateur = await utilisateurs.findOne({ email });

    if (!utilisateur) {
      console.log("Aucun utilisateur trouvé pour cet email");
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    console.log("Utilisateur trouvé :", utilisateur.email);

    // génération du token 
    const resetToken = jwt.sign(
      { userId: utilisateur._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Token généré :", resetToken);

    // sauvegarder le token en bdd
    utilisateur.resetPasswordToken = resetToken;
    utilisateur.resetPasswordExpires = Date.now() + 3600000; // 1h en millisecondes

    await utilisateur.save();
    console.log("Token sauvegardé en BDD pour l'utilisateur :", utilisateur.email);

    // URL du frontend de reinitialisation
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`

    await sendEmail(
      utilisateur.email,
      "Réinitialisation de mot de passe",
      resetLink
    );


    res.json({ message: "Lien de réinitialisation envoyé par email" });

  } catch (error) {
    console.error("Erreur dans forgotPassword :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction de réinitialisation de mot de passe
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const utilisateur = await utilisateurs.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!utilisateur) {
      return res.status(400).json({ message: "Lien invalide ou expiré" });
    }

    utilisateur.password= newPassword;
    utilisateur.resetPasswordToken = undefined;
    utilisateur.resetPasswordExpires = undefined;

    const savedUser = await utilisateur.save();
    console.log("Utilisateur sauvegardé :", savedUser);

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Token invalide ou expiré" });
  }
};

// Fonction pour récupérer l'utilisateur connecté
const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token manquant" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Correction ici : utilise decoded.id au lieu de decoded.userId
    const utilisateur = await utilisateurs.findById(decoded.id).select("-password");
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ utilisateur });
  } catch (error) {
    console.error("Erreur récupération utilisateur :", error);
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

// Exporter les fonctions pour qu’elles soient utilisées dans les routes
module.exports = {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};