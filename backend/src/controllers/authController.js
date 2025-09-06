const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const model = {
  User: require("../models/user"),
};

// génération du token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// fonction pour la réinitialisation du mot de passe
const sendResetPWSLink = async (email) => {};

// utilisation de la fonction sendPassword
const recoverAccount = async (req, res) => {};

// incription d'un utilisateur
const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, entreprise } = req.body;

    // vérification des champs obligatoire
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({
        message: "Assurez-vous de remplir tous les champs obligatoire",
      });
    }

    // vérifie que l'email n'existe pas déja
    const emailError = await model.User.findOne({
      where: {
        email,
      },
    });

    if (emailError) {
      return res.status(400).json({
        message: "Cet email existe déja",
      });
    }

    // hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await model.User.create({
      nom,
      prenom,
      email,
      entreprise,
      password: hashedPassword,
    });

    // Génération d'un token d'authentification
    const token = generateToken(user.id);

    //Envoi du token dans un cookie sécurisé
    res.cookie("access_token", token, {
      httpOnly: true, //Empêche l'accès au cookie par JavaScript (protège contre XSS). XSS-> proteger contre des saisie de js dans les formulaires
      secure: process.env.NODE_ENV === "production", // Active le cookie seulement en HTTPS. En dev (localhost) on peut le desactiver
      sameSite: "Strict", //Bloque l’envoi du cookie sur des requêtes cross-site (protège contre CSRF).
      maxAge: 24 * 60 * 60 * 1000, // 1 jour
    });

    res.status(201).json({
      success: true,
      message: "Inscription reussie",

      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        entreprise: user?.entreprise,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription de l'utilisateur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// connexion d'un utilisateur
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // vérification des champs obligatoire
    if (!email || !password) {
      return res.status(400).json({
        message: "Assurez-vous de remplir tous les champs obligatoire",
      });
    }

    // vérification de l'utilisateur
    const user = await model.User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Cet email n'existe pas",
      });
    }

    // vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Mot de passe incorrect",
      });
    }

    // Génération d'un token d'authentification
    const token = generateToken(user.id);

    //Envoi du token dans un cookie sécurisé
    res.cookie("access_token", token, {
      httpOnly: true, //Empêche l'accès au cookie par JavaScript (protège contre XSS). XSS-> proteger contre des saisie de js dans les formulaires
      secure: process.env.NODE_ENV === "production", // Active le cookie seulement en HTTPS. En dev (localhost) on peut le desactiver
      sameSite: "Strict", //Bloque l’envoi du cookie sur des requêtes cross-site (protège contre CSRF).
      maxAge: 24 * 60 * 60 * 1000, // 1 jour
    });

    res.status(200).json({
      success: true,
      message: "Connexion reussie",
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// déconnexiont d'un utilisateur
const logout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion de l'utilisateur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// récupérer les infos de l'utilisateur depuis son token (cookie)
const getMe = (req, res) => {
  const user = req.user;

  res.status(200).json({
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    entreprise: user.entreprise,
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
