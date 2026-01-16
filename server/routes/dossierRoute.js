import express from "express";
import {
  createDossier,
  getDossiers,
  getDossierById,
  updateDossier,
  closeDossier
} from "../controllers/dossierController.js";

const router = express.Router();

// Créer un dossier
router.post("/", createDossier);

// Liste de tous les dossiers
router.get("/", getDossiers);

// Dossier par ID
router.get("/:id", getDossierById);

// Modifier un dossier
router.put("/:id", updateDossier);

// Clôturer un dossier
router.put("/:id/close", closeDossier);

export default router;
