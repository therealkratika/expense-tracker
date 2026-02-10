import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense
} from "../controller/ExpenseController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getExpenses);
router.post("/", addExpense);
router.put("/:id", updateExpense); 
router.delete("/:id", deleteExpense);

export default router;
