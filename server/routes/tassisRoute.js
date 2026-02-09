// routes/tassisRoutes.js
import express from "express";
const router = express.Router();
import { createTassis,
     getTassiss, 
     deleteTassis,
     generatetassisPdf
    } from "../controllers/tassisController.js";

router.post("/", createTassis);
router.get("/tassis/:id", generatetassisPdf);
router.get("/", getTassiss);
router.delete("/:id", deleteTassis);
/* inaba  */


export default router;