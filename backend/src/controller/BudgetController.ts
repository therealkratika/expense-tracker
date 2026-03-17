import { Request, Response } from 'express';
import { findBudgetByID, updateBudgetByID } from '../repository/budget.repo';
import Joi from 'joi';

// Using a Type alias instead of an interface
type BudgetUpdate = {
  amount: number;
};

// Intersection type to add 'user' to the standard Express Request
type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

const budgetSchema = Joi.object<BudgetUpdate>({
  amount: Joi.number().positive().required(),
});

export const getBudget = async (req: Request, res: Response) => {
  try {
    // Type assertion to access req.user.id safely
    const userId = (req as AuthenticatedRequest).user.id;
    const budget = await findBudgetByID(userId);

    if (!budget) {
      return res.json({ amount: 0 });
    }

    return res.json(budget);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch budget' });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    // Validate returns the typed object
    const { amount }: BudgetUpdate = await budgetSchema.validateAsync(req.body);

    const updated = await updateBudgetByID(userId, amount);

    return res.json(updated);
  } catch (err: any) {
    // Joi errors usually carry an 'isJoi' flag or a 'name' property
    if (err.isJoi || err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Failed to update budget' });
  }
};