import admin from '../../firebaseAdmin.js';
import pool from '../database/db.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('Missing or malformed Authorization header');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify with Firebase
    const decoded = await admin.auth().verifyIdToken(token);

    // 3. Database Check
    let result = await pool.query(
      'SELECT id, name, email FROM users WHERE firebase_uid = $1',
      [decoded.uid]
    );

    if (result.rows.length === 0) {
      // 4. Robust Insert (Handles missing names/emails)
      const insert = await pool.query(
        `INSERT INTO users (name, email, firebase_uid)
         VALUES ($1, $2, $3)
         ON CONFLICT (firebase_uid) DO UPDATE SET email = EXCLUDED.email
         RETURNING id, name, email`,
        [decoded.name || 'New User', decoded.email || null, decoded.uid]
      );
      req.user = insert.rows[0];
    } else {
      req.user = result.rows[0];
    }

    next();
  } catch (err) {
    // 5. Specific Logging
    console.error('🔥 Firebase Auth Error:', err.code, err.message);

    // Return specific error for debugging (remove in production)
    res.status(401).json({
      message: 'Authentication failed',
      error: err.code,
    });
  }
};

export default authMiddleware;
