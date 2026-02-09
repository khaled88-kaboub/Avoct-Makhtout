import express from "express";
import {
  createChambre,
  getChambres,
  updateChambre,
  deleteChambre
} from "../controllers/chambreController.js";

const router = express.Router();

router.get("/", getChambres);
router.post("/", createChambre);
router.put("/:id", updateChambre);
router.delete("/:id", deleteChambre);

export default router;
