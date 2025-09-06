const jwt = require("jsonwebtoken");
const User = require("../models/user");

require("dotenv").config();

const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token; // récupérer le token depuis le cookie

  if (!token) {
    return res.status(401).json({ error: "Token manquant (cookie)" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
};

module.exports = {
    authenticate
}
