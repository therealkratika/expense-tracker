import pool from "../database/db.js";

export const getExpenseByID = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM expenses WHERE user_id=$1 ORDER BY date DESC",
    [userId]
  );
  return result.rows[0];
};

export const addExpenseRepo = async (userId, amount, category, date, description, type) => {
  const result = await pool.query(
    `INSERT INTO expenses(user_id,amount,category,date,description,type)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [userId, amount, category, date, description, type]
  );
    return result.rows[0];
};

export const deleteExpenseByID = async (expenseId, userId) => {
  await pool.query(
    "DELETE FROM expenses WHERE id=$1 AND user_id=$2",
    [expenseId, userId]
  );
}
export const updateExpenseByID = async (expenseId, userId, amount, category, date, description, type) => {
  const result = await pool.query(
    `UPDATE expenses SET amount = $1, category = $2,
            date = $3,
            description = $4,
            type = $5
        WHERE id = $6 AND user_id = $7
        RETURNING *`,
    [amount, category, date, description, type, expenseId, userId]
    );
    return result.rows[0];
};