// src/utils/multerConfig.js

const multer = require("multer");
const path = require("path"); // module natif de Node.js pour gérer les chemins de fichiers

// On utilise le stockage en mémoire
const storage = multer.memoryStorage();

// vérification du type de fichier
function checkFileType(req, file, cb) {
  if (!file || !file.originalname) {
    // si aucun fichier n'est fourni
    return cb(
      new Error("Erreur: Aucun fichier ou nom de fichier non défini."),
      false
    );
  }

  const extension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype; // Correction: mimetype au lieu de mimeType

  let fileTypes;
  let allowedMimetypes = [];
  let errorMessage;

  console.log("Vérification du fichier:", file.fieldname, file.originalname, mimeType);

  // Logique pour les profils de projet
  if (file.fieldname === "file") {
    fileTypes = /jpeg|jpg|png|gif|svg/; // Images pour les projets, y compris SVG
    allowedMimetypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"];
    errorMessage =
      "Erreur : Seules les images (JPEG, JPG, PNG, GIF, SVG) sont autorisées comme photo de projet !";
  }

  // Vérifier si l'extension du fichier correspond aux types autorisés
  const isExtValid = fileTypes.test(extension);
  
  // Vérifier si le type MIME est valide
  const isMimeValid = allowedMimetypes.includes(mimeType);
  
  console.log("File check:", {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: mimeType,
    extension,
    isExtValid,
    isMimeValid
  });

  // Si les deux vérifications sont validées on accepte le fichier sinon on le rejette
  if (isExtValid && isMimeValid) {
    return cb(null, true);
  } else {
    cb(new Error(errorMessage), false);
  }
}

// Initialisation de l'upload
const upload = multer({
  storage,// configuré ci-dessus
  limits: { fileSize: 20 * 1024 * 1024 }, // limite de taille  de fichier à 20 Mo
  fileFilter: checkFileType,
});

module.exports = upload;
