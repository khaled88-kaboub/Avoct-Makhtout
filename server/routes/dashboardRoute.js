import express from "express";
import {
  getDashboardStats,
  getUpcomingAudiences,
  getLastPaiements,
  getMonthlyFinanceStats
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/audiences-upcoming", getUpcomingAudiences);
router.get("/last-paiements", getLastPaiements);
router.get("/financial", getMonthlyFinanceStats);
export default router;
