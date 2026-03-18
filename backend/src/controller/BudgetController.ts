import { Request, Response } from 'express';
import Joi from 'joi';
import { findBudgetByID, updateBudgetByID } from '../repository/budget.repo';

// 2. TYPES & VALIDATION SCHEMA
type BudgetUpdate = {
  amount: number;
};

const budgetSchema = Joi.object<BudgetUpdate>({
  amount: Joi.number().positive().required(),
});

// 3. UTILITY ERROR HANDLER
const handleBudgetError = (res: Response, err: any, defaultMsg: string) => {
  const isValidation = err.isJoi || err.name === 'ValidationError';
  return res.status(isValidation ? 400 : 500).json({
    message: isValidation ? err.message : defaultMsg,
  });
};

// 4. CONTROLLERS
export const getBudget = async (req: Request, res: Response) => {
  try {
    const budget = await findBudgetByID(req.user.id);
    // Returns budget or a default object if null
    return res.json(budget ?? { amount: 0 });
  } catch (error) {
    return handleBudgetError(res, error, 'Failed to fetch budget');
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    // Validate and get typed data
    const value: BudgetUpdate = await budgetSchema.validateAsync(req.body);

    const updated = await updateBudgetByID(req.user.id, value.amount);
    return res.json(updated);
  } catch (err: any) {
    return handleBudgetError(res, err, 'Failed to update budget');
  }
};