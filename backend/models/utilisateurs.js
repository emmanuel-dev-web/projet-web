const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//définir le schéma de l'utilisateur
const utilisateurSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
      
    },

    resetPasswordToken: {
        type: String,
    },

    resetPasswordExpires: {
        type: String,
    }

});

// hachage du mot de passe si il est nouveau ou alors modifié ici on utilise la fonction pre save ie avant la sauvegarde
utilisateurSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // ne hash que si le password est modifié ou nouveau

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Creer le model basé sur le schéma
const utilisateurs = mongoose.model('utilisateurs',utilisateurSchema);
module.exports = utilisateurs;