//Fonction de connexion qui est appellée quand un utilisateur tente de se connecter 

const utilisateurs = require("../models/utilisateurs");


// Appeler la fonction de hashage de mot de passe
const bcrypt = require('bcryptjs');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Tentative de connexion avec :", email, password);

  try {
    const utilisateur = await utilisateurs.findOne({ email });
    if (!utilisateur) {
      console.log(" Aucun utilisateur trouvé pour cet email");
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    console.log("Utilisateur trouvé :", utilisateur.email);
    console.log("Mot de passe reçu :", password);
    console.log("Hash en base :", utilisateur.password);

    const isMatch = await bcrypt.compare(password, utilisateur.password);
    console.log("Résultat comparaison bcrypt :", isMatch);

    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    res.status(200).json({ message: "Connexion réussie", utilisateur });
  } catch (error) {
    console.error("Erreur de connexion :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log("Requête reçue avec :", req.body);

    const existingUser = await utilisateurs.findOne({ email });
    if (existingUser) {
      console.log("Email déjà utilisé");
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

   console.log("password reçu :", password);

    const newUser = new utilisateurs({
      name,
      email,
      password: password,
    });

    await newUser.save();
    console.log("Nouvel utilisateur sauvegardé");

    return res.status(201).json({ message: "Utilisateur enregistré avec succès !" ,
        passwordUtilise: password
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

//on export la fonction pour quelle soit utilisée dans les routes ie dans dautres fichiers
module.exports = {loginUser,registerUser};