// routes/delegationRoutes.js
import express from "express";
const router = express.Router();
import { createDelegation,
     getDelegations, 
     deleteDelegation,
     generateinabaPdf
    } from "../controllers/delegationController.js";

router.post("/", createDelegation);
router.get("/inaba/:id", generateinabaPdf);
router.get("/", getDelegations);
router.delete("/:id", deleteDelegation);
/* inaba  */


export default router;