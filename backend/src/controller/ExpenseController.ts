import { Request, Response } from 'express';
import joi from 'joi';
import {
  getExpenseByID,
  addExpenseRepo,
  updateExpenseByID,
  deleteExpenseByID,
} from '../repository/expense.repo';
type ExpenseInput = {
  amount: number;
  category: string;
  date: Date;
  description?: string;
  type: 'income' | 'expense';
};

const expenseSchema = joi.object<ExpenseInput>({
  amount: joi.number().positive().required(),
  category: joi.string().required(),
  date: joi.date().required(),
  description: joi.string().allow('').optional(),
  type: joi.string().valid('income', 'expense').required(),
});


export const getExpenses = async (req: Request, res: Response) => {
  try {
    const result = await getExpenseByID(req.user.id);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

export const addExpense = async (req: Request, res: Response) => {
  try {
    const value: ExpenseInput = await expenseSchema.validateAsync(req.body);

    const result = await addExpenseRepo(
      req.user.id,
      value.amount,
      value.category,
      value.date,
      value.description || '',
      value.type
    );
    
    return res.status(201).json(result);
  } catch (err: any) {
    const status = err.isJoi ? 400 : 500;
    return res.status(status).json({ message: err.message });
  }
};

export const updateExpense = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const value: ExpenseInput = await expenseSchema.validateAsync(req.body);

    const result = await updateExpenseByID(
      id,
      req.user.id,
      value.amount,
      value.category,
      value.date,
      value.description || '',
      value.type
    );

    if (!result) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    return res.json(result);
  } catch (err: any) {
    const status = err.isJoi ? 400 : 500;
    return res.status(status).json({ 
      message: err.isJoi ? err.message : 'Failed to update expense' 
    });
  }
};
export const deleteExpense = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await deleteExpenseByID(req.params.id, req.user.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete expense' });
  }
};