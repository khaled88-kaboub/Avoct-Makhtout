import express from "express";
import {
  createAudience,
  getAudiences,
  getAudienceById,
  updateAudience,
  deleteAudience
} from "../controllers/audienceController.js";

const router = express.Router();

/* CRUD */
router.post("/", createAudience);          // إنشاء جلسة
router.get("/", getAudiences);              // جميع الجلسات (مع فلاتر)
router.get("/:id", getAudienceById);        // جلسة واحدة
router.put("/:id", updateAudience);         // تعديل
router.delete("/:id", deleteAudience);      // حذف

export default router;
