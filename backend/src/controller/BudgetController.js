import pool from "../database/db.js";
import joi from "joi";
const budgetSchema = joi.object({
  amount: joi.number().positive().required(),
});
export const getBudget = async(req,res)=>{
    const result = await pool.query(
        "SELECT amount FROM budgets WHERE user_id=$1",
        [req.user.id]
    );
    if(!result.rows.length){
        return res.json({amount:0});
    }
    res.json(result.rows[0]);
};
export const updateBudget = async (req, res) => {
  const value = await budgetSchema.validateAsync(req.body);
  const { amount } = value;
  await pool.query(
    `INSERT INTO budgets (user_id, amount)
     VALUES ($1, $2)
     ON CONFLICT (user_id)
     DO UPDATE SET amount = $2`,
    [req.user.id, amount]
  );

  res.json({ amount });
};