
import pool from "../database/db";
import { QueryResult } from "pg";

export interface UserRow {
  id: string | number;
  name: string;
  email: string | null;
}

export const upsertUser = async (
  name: string,
  email: string | null,
  firebase_uid: string
): Promise<UserRow> => {
  const result: QueryResult<UserRow> = await pool.query(
    `INSERT INTO users (name, email, firebase_uid) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (firebase_uid) 
     DO UPDATE SET email = EXCLUDED.email 
     RETURNING id, name, email`,
    [name, email, firebase_uid]
  );

  return result.rows[0];
};