const express = require("express");

const { login, logout, getMe } = require("../controllers/authController");
const { register } = require("../controllers/authController");

const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();
// router.use(authenticate)

// route d'inscription
router.post("/register", register);
// route de connexion
router.post("/login", login);
// route de déconnexion
router.post("/logout", logout);
// route de récupération des infos de l'utilisateur
router.get("/getMe", authenticate, getMe);

module.exports = router;
