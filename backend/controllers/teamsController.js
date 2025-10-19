const Team = require("../models/teams");

// Récupérer toutes les équipes de l'utilisateur connecté
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer une équipe spécifique
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!team) {
      return res.status(404).json({ message: "Équipe non trouvée" });
    }
    
    res.json(team);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'équipe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Créer une nouvelle équipe
const createTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    
    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Le nom de l'équipe est requis" });
    }
    
    // Traitement des membres (string vers array)
    let membersArray = [];
    if (members) {
      if (Array.isArray(members)) {
        membersArray = members.filter(m => m && m.trim() !== "");
      } else if (typeof members === "string") {
        membersArray = members
          .split(",")
          .map(m => m.trim())
          .filter(m => m !== "");
      }
    }
    
    const newTeam = new Team({
      name: name.trim(),
      description: description?.trim() || "",
      members: membersArray,
      user: req.user.id,
    });
    
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Modifier une équipe existante
const updateTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    
    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Le nom de l'équipe est requis" });
    }
    
    // Traitement des membres
    let membersArray = [];
    if (members) {
      if (Array.isArray(members)) {
        membersArray = members.filter(m => m && m.trim() !== "");
      } else if (typeof members === "string") {
        membersArray = members
          .split(",")
          .map(m => m.trim())
          .filter(m => m !== "");
      }
    }
    
    const updatedTeam = await Team.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        name: name.trim(),
        description: description?.trim() || "",
        members: membersArray,
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedTeam) {
      return res.status(404).json({ message: "Équipe non trouvée" });
    }
    
    res.json(updatedTeam);
  } catch (error) {
    console.error("Erreur lors de la modification de l'équipe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une équipe
const deleteTeam = async (req, res) => {
  try {
    const deletedTeam = await Team.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!deletedTeam) {
      return res.status(404).json({ message: "Équipe non trouvée" });
    }
    
    res.json({ message: "Équipe supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'équipe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
};
