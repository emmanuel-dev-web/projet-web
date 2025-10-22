// models/event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Format "HH:MM"
    default: "09:00"
  },
  endTime: {
    type: String, // Format "HH:MM" 
    default: "10:00"
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NouvelUtilisateur",
    required: true
  },
  status: {
    type: String,
    enum: ["planifie", "en_cours", "termine", "annule"],
    default: "planifie"
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
eventSchema.index({ user: 1, date: 1 });
eventSchema.index({ projectId: 1 });
eventSchema.index({ date: 1, status: 1 });

// Middleware pour supprimer automatiquement les événements passés
eventSchema.statics.removeExpiredEvents = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.deleteMany({
    date: { $lt: today },
    status: { $in: ["termine", "annule"] }
  });
};

module.exports = mongoose.model("Event", eventSchema);