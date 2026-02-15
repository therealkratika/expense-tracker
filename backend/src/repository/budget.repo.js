import pool from "../database/db.js";

export const findBudgetByID = async(userId)=>{
    const result = await pool.query(
        "SELECT amount FROM budgets WHERE user_id=$1",
        [userId]
    );
    return result.rows[0];
}
export const updateBudgetByID = async(userId, amount)=>{
    await pool.query(
        `INSERT INTO budgets (user_id, amount)
            VALUES ($1, $2)
            ON CONFLICT (user_id)
            DO UPDATE SET amount = $2`,
        [userId, amount]
    );
}