const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Extraire le token après "Bearer "
      const token = authHeader.split(' ')[1];

      // Vérifier le token avec la clé secrète
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attacher les infos utilisateur au req pour usage ultérieur
      req.user = { _id: decoded.id };

      // Passer au middleware suivant
      next();
    } catch (error) {
      // Token invalide ou expiré
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  } else {
    // Pas de token dans l'en-tête Authorization
    return res.status(401).json({ message: 'Pas de token, accès refusé' });
  }
};

module.exports = protect;
