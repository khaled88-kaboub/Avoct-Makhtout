import express from "express";

import {
  createPaiement,
  getPaiements,
  getPaiementById,
  updatePaiement,
  deletePaiement,
  getPaiementsByDossier

} from "../controllers/paiementController.js";
import { generatePaiementPdf } from "../controllers/paiementController.js";
const router = express.Router();

/* CRUD */
router.post("/", createPaiement);
router.get("/", getPaiements);
router.get("/pdf/:id", generatePaiementPdf);

router.get("/:id", getPaiementById);
router.put("/:id", updatePaiement);
router.delete("/:id", deletePaiement);

/* Paiements par dossier */
router.get("/dossier/:dossierId", getPaiementsByDossier);

export default router;
