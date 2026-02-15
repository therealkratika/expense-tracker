import admin from "../../firebaseAdmin.js"
import pool from "../database/db.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);

    const result = await pool.query(
       "SELECT id, name, email FROM users WHERE firebase_uid = $1",
      [decoded.uid]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = result.rows[0];
    next();
  } catch {
    res.status(401).json({ message: "Token failed" });
  }
};

export default authMiddleware;
