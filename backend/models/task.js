const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Supprime les espaces inutiles
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["a_faire", "en_cours", "termine"], // On limite les valeurs
      default: "a_faire",
    },
    deadline: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "utilisateurs",
      required: true,
    },
  },
  { timestamps: true } // Ajoute automatiquement createdAt & updatedAt
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;