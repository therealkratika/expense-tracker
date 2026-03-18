import express, { Router } from 'express';
import authMiddleware from '../middleware/AuthMiddleware';
import {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
} from '../controller/ExpenseController';

const router: Router = express.Router();

router.use(authMiddleware);

router.get('/', getExpenses);
router.post('/', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;