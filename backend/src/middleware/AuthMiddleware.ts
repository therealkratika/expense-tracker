import { Request, Response, NextFunction } from 'express';
import admin from '../../firebaseAdmin';
import pool from '../database/db';
import { upsertUser } from "../repository/user.repo";
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string | number;
        name: string;
        email: string | null;
      };
    }
  }
}
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    const user = await upsertUser(
      decoded.name || "New User",
      decoded.email || null,
      decoded.uid
    );

    req.user = user;

    next();
  } catch (err: any) {
    return res.status(401).json({
      message: "Authentication failed",
      error: err.code || "UNAUTHORIZED",
    });
  }
};

export default authMiddleware;