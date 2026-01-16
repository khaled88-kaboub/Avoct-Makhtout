import express from "express";
import {
  getDashboardStats,
  getUpcomingAudiences,
  getLastPaiements
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/audiences-upcoming", getUpcomingAudiences);
router.get("/last-paiements", getLastPaiements);

export default router;
