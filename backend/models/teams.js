const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  members: [{
    type: String,
    trim: true,
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "utilisateurs",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes par utilisateur
teamSchema.index({ user: 1, createdAt: -1 });

// Méthode pour formater la date de création
teamSchema.methods.getFormattedDate = function() {
  return this.createdAt.toISOString().slice(0, 10);
};

module.exports = mongoose.model("Team", teamSchema);
