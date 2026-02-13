
import admin from "../../firebaseAdmin.js";
import jwt from "jsonwebtoken";
import pool from "../database/db.js";
export const signin = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    if (!decoded.email_verified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const { uid, email, name } = decoded;

    // Check if user exists
    let result = await pool.query(
      "SELECT * FROM users WHERE firebase_uid = $1",
      [uid]
    );

    let user;

    if (result.rows.length === 0) {
      // Create user in DB
      const insert = await pool.query(
        `INSERT INTO users (name, email, firebase_uid)
         VALUES ($1, $2, $3)
         RETURNING id, name, email`,
        [name || "User", email, uid]
      );

      user = insert.rows[0];
    } else {
      user = result.rows[0];
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
