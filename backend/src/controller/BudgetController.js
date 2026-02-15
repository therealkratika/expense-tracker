import { findBudgetByID, updateBudgetByID } from "../repository/budget.repo.js";
import Joi from "joi";

const budgetSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

export const getBudget = async (req, res) => {
  try {
    const budget = await findBudgetByID(req.user.id);

    if (!budget) {
      return res.json({ amount: 0 });
    }

    res.json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch budget" });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { amount } = await budgetSchema.validateAsync(req.body);

    const updated = await updateBudgetByID(req.user.id, amount);

    res.json(updated);
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ message: err.message });
    }

    console.error(err);
    res.status(500).json({ message: "Failed to update budget" });
  }
};
