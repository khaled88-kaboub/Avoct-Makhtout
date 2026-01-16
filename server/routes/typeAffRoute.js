import express from "express";
import {
  createTypeAff,
  getAllTypeAff,
  getTypeAffById,
  updateTypeAff,
  deleteTypeAff
} from "../controllers/typeAffController.js";

const router = express.Router();

router.post("/", createTypeAff);
router.get("/", getAllTypeAff);
router.get("/:id", getTypeAffById);
router.put("/:id", updateTypeAff);
router.delete("/:id", deleteTypeAff);

export default router;
