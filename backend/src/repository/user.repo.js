import pool from "../database/db.js";

export const findUserById = async (firebaseUid) => {
  const result = await pool.query("SELECT * FROM users WHERE firebase_uid = $1", [firebaseUid]);
  return result.rows[0];
};

export const createUser = async (name, email, firebaseUid) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, firebase_uid)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name, email, firebaseUid]
  );
  return result.rows[0];
};  