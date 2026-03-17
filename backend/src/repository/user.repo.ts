import pool from "../database/db";
import { QueryResult } from 'pg';

type UserRow = {
  id: number | string;
  name: string;
  email: string | null;
  firebase_uid: string;
};

type UserResponse = {
  id: number | string;
  name: string;
  email: string | null;
};

export const findUserById = async (firebaseUid: string): Promise<UserRow | undefined> => {
  const result: QueryResult<UserRow> = await pool.query(
    "SELECT * FROM users WHERE firebase_uid = $1", 
    [firebaseUid]
  );
  return result.rows[0];
};

export const createUser = async (
  name: string, 
  email: string | null, 
  firebaseUid: string
): Promise<UserResponse> => {
  const result: QueryResult<UserResponse> = await pool.query(
    `INSERT INTO users (name, email, firebase_uid)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name, email, firebaseUid]
  );
  return result.rows[0];
};