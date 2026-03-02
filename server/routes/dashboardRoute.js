import express from "express";
import {
  getDashboardStats,
  getUpcomingAudiences,
  getLastPaiements,
  getMonthlyFinanceStats,
  getDossiersFinanceSummary
  
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/audiences-upcoming", getUpcomingAudiences);
router.get("/last-paiements", getLastPaiements);
router.get("/financial", getMonthlyFinanceStats);
router.get("/summary", getDossiersFinanceSummary)
export default router;
