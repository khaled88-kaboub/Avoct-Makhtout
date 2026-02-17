import express from "express";
import {
  createFraisGle,
  getFraisGles,
  updateFraisGle,
  deleteFraisGle
} from "../controllers/fraisGleController.js";

const router = express.Router();

router.get("/", getFraisGles);
router.post("/", createFraisGle);
router.put("/:id", updateFraisGle);
router.delete("/:id", deleteFraisGle);

export default router;