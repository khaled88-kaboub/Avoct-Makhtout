import express from "express";
import {
  createDesignationDepJur,
  getDesignationDepJurs,
  updateDesignationDepJur,
  deleteDesignationDepJur
} from "../controllers/designationDepJurController.js";

const router = express.Router();

router.get("/", getDesignationDepJurs);
router.post("/", createDesignationDepJur);
router.put("/:id", updateDesignationDepJur);
router.delete("/:id", deleteDesignationDepJur);

export default router;