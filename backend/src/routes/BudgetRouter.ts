import express, { Router } from 'express';
import authMiddleware from '../middleware/AuthMiddleware';
import { getBudget, updateBudget } from '../controller/BudgetController';

const router: Router = express.Router();

router.use(authMiddleware);
router.get("/", getBudget);
router.put("/", updateBudget);

export default router;