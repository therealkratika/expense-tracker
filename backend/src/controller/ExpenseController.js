import pool from "../database/db.js";
import joi from "joi";
const expenseSchema = joi.object({
  amount: joi.number().positive().required(),
  category: joi.string().required(),
  date: joi.date().required(),
  description: joi.string().allow("").optional(),
  type: joi.string().valid("income", "expense").required(),
});

export const getExpenses = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM expenses WHERE user_id=$1 ORDER BY date DESC",
    [req.user.id]
  );
  res.json(result.rows);
};
export const addExpense = async (req, res) => {
  try {
    const value = await expenseSchema.validateAsync(req.body);

    const { amount, category, date, description, type } = value;

    const result = await pool.query(
      `INSERT INTO expenses(user_id,amount,category,date,description,type)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.id, amount, category, date, description, type]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Add expense error:", err);
    res.status(400).json({ message: err.message });
  }
};


export const deleteExpense = async (req, res) => {
  await pool.query(
    "DELETE FROM expenses WHERE id=$1 AND user_id=$2",
    [req.params.id, req.user.id]
  );
  res.json({ success: true });
};
export const updateExpense = async (req, res) => {
  const value = await expenseSchema.validateAsync(req.body);
  const { id } = req.params;
  const { amount, category, date, description, type } = value;

  try {
    const result = await pool.query(
      `UPDATE expenses
       SET amount = $1,
           category = $2,
           date = $3,
           description = $4,
           type = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [amount, category, date, description, type, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update expense error:", err);
    res.status(500).json({ message: "Failed to update expense" });
  }
};

