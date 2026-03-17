import { Request, Response } from 'express';
import {
  getExpenseByID,
  addExpenseRepo,
  updateExpenseByID,
  deleteExpenseByID,
} from '../repository/expense.repo';
import joi from 'joi';

// 1. Shapes for Types
type ExpenseInput = {
  amount: number;
  category: string;
  date: Date;
  description?: string;
  type: 'income' | 'expense';
};

type AuthenticatedRequest = {
  user: {
    id: string;
  };
};

type ExpenseParams = {
  id: string;
};

// 2. Validation
const expenseSchema = joi.object<ExpenseInput>({
  amount: joi.number().positive().required(),
  category: joi.string().required(),
  date: joi.date().required(),
  description: joi.string().allow('').optional(),
  type: joi.string().valid('income', 'expense').required(),
});

// 3. Controllers
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown as AuthenticatedRequest).user.id;
    const result = await getExpenseByID(userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

export const addExpense = async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown as AuthenticatedRequest).user.id;
    const value: ExpenseInput = await expenseSchema.validateAsync(req.body);
    const { amount, category, date, description, type } = value;

    const result = await addExpenseRepo(
      userId,
      amount,
      category,
      date,
      description || '',
      type
    );
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteExpense = async (req: Request<ExpenseParams>, res: Response) => {
  try {
    const userId = (req as unknown as AuthenticatedRequest).user.id;
    const { id } = req.params;
    
    await deleteExpenseByID(id, userId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete expense' });
  }
};

export const updateExpense = async (req: Request<ExpenseParams>, res: Response) => {
  try {
    const userId = (req as unknown as AuthenticatedRequest).user.id;
    const { id } = req.params;
    
    const value: ExpenseInput = await expenseSchema.validateAsync(req.body);
    const { amount, category, date, description, type } = value;

    const result = await updateExpenseByID(
      id,
      userId,
      amount,
      category,
      date,
      description || '',
      type
    );

    if (!result) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    return res.json(result);
  } catch (err: any) {
    const status = err.isJoi ? 400 : 500;
    return res.status(status).json({ 
      message: err.isJoi ? err.message : 'Failed to update expense',
      error: err.message 
    });
  }
};