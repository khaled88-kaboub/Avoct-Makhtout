import express from "express";
import {
  createTribunal,
  getTribunals,
  updateTribunal,
  deleteTribunal
} from "../controllers/tribunalController.js";

const router = express.Router();

router.post("/", createTribunal);
router.get("/", getTribunals);
router.put("/:id", updateTribunal);
router.delete("/:id", deleteTribunal);

export default router;
