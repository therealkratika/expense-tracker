import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { getBudget, updateBudget } from "../controller/BudgetController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getBudget);
router.put("/", updateBudget);

export default router;
