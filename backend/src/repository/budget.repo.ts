import pool from "../database/db";
import { QueryResult } from "pg";

type BudgetRow = {
  amount: number;
  month: number;
  year: number;
};

export const findBudgetByID = async (
  userId: string | number
): Promise<BudgetRow | undefined> => {
  const currentDate = new Date();

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const result: QueryResult<BudgetRow> = await pool.query(
    `SELECT amount, month, year
     FROM budgets
     WHERE user_id=$1 AND month=$2 AND year=$3`,
    [userId, month, year]
  );

  return result.rows[0];
};

export const updateBudgetByID = async (
  userId: string | number,
  amount: number
): Promise<BudgetRow> => {
  const currentDate = new Date();

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const result: QueryResult<BudgetRow> = await pool.query(
    `INSERT INTO budgets (user_id, amount, month, year)
     VALUES ($1, $2, $3, $4)

     ON CONFLICT (user_id)
     DO UPDATE SET
       amount = EXCLUDED.amount,
       month = EXCLUDED.month,
       year = EXCLUDED.year

     RETURNING amount, month, year`,
    [userId, amount, month, year]
  );

  return result.rows[0];
};