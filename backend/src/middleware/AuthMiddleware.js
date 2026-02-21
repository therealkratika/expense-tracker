import admin from '../../firebaseAdmin.js';
import pool from '../database/db.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // Try to find user
    let result = await pool.query(
      'SELECT id, name, email FROM users WHERE firebase_uid = $1',
      [decoded.uid]
    );

    // 🔥 AUTO-CREATE USER IF NOT FOUND
    if (result.rows.length === 0) {
      const insert = await pool.query(
        `INSERT INTO users (name, email, firebase_uid)
         VALUES ($1, $2, $3)
         RETURNING id, name, email`,
        [decoded.name || 'User', decoded.email, decoded.uid]
      );

      req.user = insert.rows[0];
      return next();
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Token failed' });
  }
};

export default authMiddleware;
