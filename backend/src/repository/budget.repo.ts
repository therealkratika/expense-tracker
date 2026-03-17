import pool from "../database/db";
import { QueryResult } from 'pg';
type BudgetRow = {
  amount: number;
};
export const findBudgetByID = async (userId: string | number): Promise<BudgetRow | undefined> => {
  const result: QueryResult<BudgetRow> = await pool.query(
    "SELECT amount FROM budgets WHERE user_id=$1",
    [userId]
  );
  
  return result.rows[0];
};
export const updateBudgetByID = async (userId: string | number, amount: number): Promise<BudgetRow> => {
  const result: QueryResult<BudgetRow> = await pool.query(
    `INSERT INTO budgets (user_id, amount)
     VALUES ($1, $2)
     ON CONFLICT (user_id)
     DO UPDATE SET amount = $2
     RETURNING amount`,
    [userId, amount]
  );

  return result.rows[0];
};