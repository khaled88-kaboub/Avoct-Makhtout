import express from "express";
import {
  createTypeAudience,
  getTypeAudiences,
  updateTypeAudience,
  deleteTypeAudience
} from "../controllers/typeAudienceController.js";

const router = express.Router();

router.get("/", getTypeAudiences);
router.post("/", createTypeAudience);
router.put("/:id", updateTypeAudience);
router.delete("/:id", deleteTypeAudience);

export default router;