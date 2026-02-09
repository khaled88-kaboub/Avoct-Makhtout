import express from "express";
import {
  createClasse,
  getClasses,
  updateClasse,
  deleteClasse
} from "../controllers/classeController.js";

const router = express.Router();

router.get("/", getClasses);
router.post("/", createClasse);
router.put("/:id", updateClasse);
router.delete("/:id", deleteClasse);

export default router;