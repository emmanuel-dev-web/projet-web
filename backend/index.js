//index.js
console.log(" Le fichier index.js est exécuté");
require('dotenv').config();


const express = require("express");
const cors = require("cors"); //  importer cors

const app = express();
const PORT = 3001; // port au tourne mon backend

//Middleware pour parser le json
app.use(express.json());

// Autoriser tous les ports localhost en développement
app.use(cors({
  origin: /^http:\/\/localhost:\d+$/, // Accepte tous les ports localhost
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

//import du router d'authentification
const authRoutes = require ("./routes/authRoutes")

//import du router de dashboard
const dashboardRoutes = require ("./routes/dashboardRoutes")

//import du router de tasks
const taskRoutes = require ("./routes/taskRoutes")

//import du router de projects
const projectRoutes = require ("./routes/projectRoutes")

//import du router de teams
const teamsRoutes = require ("./routes/teamsRoutes")

//import du router de calendar
const calendarRoutes = require ("./routes/calendarRoutes")

// definition du chemin global pour toutes les routes de dashboard
app.use("/api", dashboardRoutes) ;

// definition du chemin global pour toutes les routes de tasks
app.use("/api/tasks", taskRoutes);

// definition du chemin global pour toutes les routes de projects
app.use("/api/projects", projectRoutes);

// definition du chemin global pour toutes les routes de teams
app.use("/api/teams", teamsRoutes);

// definition du chemin global pour toutes les routes de calendar
app.use("/api/calendar", calendarRoutes);

// definition d'un chemin global pour toutes les routes 
app.use("/api/auth/", authRoutes); // cest juste pour dire que toutes les routes qui seront dans authRoutes vont commencer par /api/auth

//Route de test
app.get("/",(req,res) => {res.send("server node.js fonctionne !")});


//Connecter mon backend à ma base de données mongoose
const mongoose = require ('mongoose') // import de mongoose

//Creer une fonction pour connecter la base de données MongoDB
async function connectDB() {
  try {

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB avec succès :', conn.connection.host);
    
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
  }
}

connectDB(); 



// Démarrage du serveur
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});