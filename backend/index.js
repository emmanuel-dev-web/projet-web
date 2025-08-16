//index.js
console.log(" Le fichier index.js est exécuté");
require('dotenv').config();

const express = require("express");
const cors = require("cors"); //  importer cors

const app = express();
const PORT = 3001; // port au tourne mon backend

//Middleware pour parser le json
app.use(express.json());

// Autoriser le frontend sur localhost:5173
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"], // les méthodes que tu utilises
  credentials: true, // si tu utilises les cookies/sessions
}));

//import du router d'authentification
const authRoutes = require ("./routes/authRoutes")

// definition d'un chemin global pour toutes les routes
app.use("/api/auth/", authRoutes); // cest juste pour dire que toutes les routes qui seront dans authRoutes vont commencer par /api/auth

//Route de test
app.get("/",(req,res) => {res.send("server node.js fonctionne !")});


//Connecter mon backend à ma base de données mongoose
const mongoose = require ('mongoose') // import de mongoose

//Creer une fonction pour connecter la base de données MongoDB
async function connectDB() {
  try {
    
    await mongoose.connect('mongodb://127.0.0.1:27017/alphatasks', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connecté à MongoDB avec succès');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
  }
}

connectDB();



// Démarrage du serveur
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});