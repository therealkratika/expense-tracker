import { Request, Response, NextFunction } from 'express';
import admin from '../../firebaseAdmin';
import pool from '../database/db';

type User = {
  id: string | number;
  name: string;
  email: string | null;
};

type AuthenticatedRequest = Request & {
  user?: User;
};

const authMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void | Response> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    let result = await pool.query(
      'SELECT id, name, email FROM users WHERE firebase_uid = $1',
      [decoded.uid]
    );

    if (result.rows.length === 0) {
      const insert = await pool.query(
        `INSERT INTO users (name, email, firebase_uid) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (firebase_uid) DO UPDATE SET email = EXCLUDED.email 
         RETURNING id, name, email`,
        [decoded.name || 'New User', decoded.email || null, decoded.uid]
      );

      (req as AuthenticatedRequest).user = insert.rows[0];
    } else {
      (req as AuthenticatedRequest).user = result.rows[0];
    }

    next();
  } catch (err: any) {
    return res.status(401).json({
      message: 'Authentication failed',
      error: err.code,
    });
  }
};

export default authMiddleware;