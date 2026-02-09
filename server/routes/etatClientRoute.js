import express from "express";
import {
  createEtatClient,
  getEtatClients,
  updateEtatClient,
  deleteEtatClient
} from "../controllers/etatClientController.js";

const router = express.Router();

router.post("/", createEtatClient);
router.get("/", getEtatClients);
router.put("/:id", updateEtatClient);
router.delete("/:id", deleteEtatClient);

export default router;