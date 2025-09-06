const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const helmet = require("helmet");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const pvGisRoutes = require("./routes/pvGisRoutes");
const cellPvManagementRoutes = require("./routes/cellPVManagementRoutes");
const onduleurManagementRoutes = require("./routes/onduleurManagementRoutes");
const regulateurManagementRoutes = require("./routes/regulateurManagementRoutes");
const projectRoutes = require("./routes/projectRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const configurationRoutes=require("./routes/configurationRoutes");
const dimensionRoutes= require("./routes/dimensionRoutes");
// Load environment variables
dotenv.config();

//initialize express app
const app = express();
app.use(cookieParser());

// Activate security headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    // origin: true,
    credentials: true,
  })
);

// Uploads routes - Définies avant les routes de projet car les projets peuvent dépendre des uploads
app.use("/api/uploads", uploadRoutes);

// Middleware pour parser le JSON et les données de formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome inside my Application");
});

// Define routes

// rendre le dossier "uploads" accessible publiquement
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../upload"), {
    setHeaders: (res, path, stat) => {
      // Autorise l’accès cross-origin pour les images
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Auth routes
app.use("/api/auth", authRoutes);

// PVGIS API routes
app.use("/api/pvgis", pvGisRoutes);

// Cell PV routes
app.use("/api/cell-pv", cellPvManagementRoutes);

// Onduleur routes
app.use("/api/onduleur", onduleurManagementRoutes);

// Regulateur routes
app.use("/api/regulateur", regulateurManagementRoutes);

// Projet routes
app.use("/api/project", projectRoutes);

// Configuration routes
app.use("/api/configuration", configurationRoutes);

// Dimensionnement routes
app.use("/api/dimensionning",dimensionRoutes)

const PORT = process.env.SERVER_PORT || 5000;
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
