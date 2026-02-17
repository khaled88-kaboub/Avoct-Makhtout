import express from "express";
import {
  createFraisJur,
  getFraisJurs,
  updateFraisJur,
  deleteFraisJur
} from "../controllers/fraisJurController.js";

const router = express.Router();

router.get("/", getFraisJurs);
router.post("/", createFraisJur);
router.put("/:id", updateFraisJur);
router.delete("/:id", deleteFraisJur);

export default router;