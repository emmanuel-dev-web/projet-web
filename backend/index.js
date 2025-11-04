// index.js
console.log("Le fichier index.js est exécuté");

// Charger les variables d'environnement
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001; // utilise le port Render si disponible

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS : autoriser localhost pour dev et frontend Render pour prod
app.use(cors({
  origin: [
    /^http:\/\/localhost:\d+$/,                   // localhost pour développement
    'https://projet-web-4-s2fz.onrender.com',     // frontend Render
    'https://projet-web-front-tt1c.onrender.com'
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Route test simple
app.get("/", (req, res) => {
  res.send("Server Node.js fonctionne !");
});

// ------------------ Connexion à MongoDB ------------------
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connecté à MongoDB avec succès :', conn.connection.host);
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
  }
}

connectDB();

// ------------------ Démarrage du serveur ------------------
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`URL publique Render : ${process.env.RENDER_EXTERNAL_URL || "non défini"}`);
});
