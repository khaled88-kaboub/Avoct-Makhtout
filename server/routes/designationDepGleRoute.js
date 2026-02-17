import express from "express";
import {
  createDesignationDepGle,
  getDesignationDepGles,
  updateDesignationDepGle,
  deleteDesignationDepGle
} from "../controllers/designationDepGleController.js";

const router = express.Router();

router.get("/", getDesignationDepGles);
router.post("/", createDesignationDepGle);
router.put("/:id", updateDesignationDepGle);
router.delete("/:id", deleteDesignationDepGle);

export default router;