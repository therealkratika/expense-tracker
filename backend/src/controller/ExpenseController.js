import { getExpenseByID,addExpenseRepo,updateExpenseByID, deleteExpenseByID } from "../repository/expense.repo.js";
import joi from "joi";
const expenseSchema = joi.object({
  amount: joi.number().positive().required(),
  category: joi.string().required(),
  date: joi.date().required(),
  description: joi.string().allow("").optional(),
  type: joi.string().valid("income", "expense").required(),
});

export const getExpenses = async (req, res) => {
  const result = await getExpenseByID(req.user.id);
  res.json(result);
};

export const addExpense = async (req, res) => {
  try {
    const value = await expenseSchema.validateAsync(req.body);

    const { amount, category, date, description, type } = value;

    const result = await addExpenseRepo(req.user.id, amount, category, date, description, type);

    res.status(201).json(result);

  } catch (err) {
    console.error("Add expense error:", err);
    res.status(400).json({ message: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  await deleteExpenseByID(req.params.id, req.user.id);
  res.json({ success: true });
};

export const updateExpense = async (req, res) => {
  const value = await expenseSchema.validateAsync(req.body);
  const { id } = req.params;
  const { amount, category, date, description, type } = value;

  try {
    const result = await updateExpenseByID(id, req.user.id, amount, category, date, description, type);

    if (!result) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(result);
  } catch (err) {
    console.error("Update expense error:", err);
    res.status(500).json({ message: "Failed to update expense" });
  }
};

