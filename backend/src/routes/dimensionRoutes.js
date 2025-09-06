const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

const {
    consomationProfile,
    getConsommationProfileµByConfiguration,
    updateConsommationProfile,
    deleteConsommationProfile, 
}=require("../controllers/dimensionningController")

// Récupérer le profile de consommation d'une configuration
router.get("/:configId/load_profil_dimension",  authenticate,getConsommationProfileµByConfiguration)

// Créer un profil (consommation) 
router.post("/:configId/load_profil_dimension",authenticate,consomationProfile)

// modifier le profile de consommation d'une configuration
router.patch("/:configId/load_profil_dimension",authenticate,updateConsommationProfile)

// supprimer le profile de consommation d'une configuaration 
router.delete("/:configId/load_profil_dimension",authenticate,deleteConsommationProfile
)
module.exports=router;

