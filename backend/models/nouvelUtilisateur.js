const bcrypt = require('bcryptjs');

const hashEnBase = "$2b$10$o54hC.W7RwHeH9BDoyAmie.y5oL55hkjKDfW19tfdxjY7enphJhly";
const motDePasseSaisi = "abc123";

bcrypt.compare(motDePasseSaisi, hashEnBase)
  .then(result => console.log("Résultat comparaison :", result))
  .catch(err => console.error(err));
