import pool from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import joi from "joi";
const schema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
export const signup = async (req, res) => {
  try {
    const value = await schema.validateAsync(req.body);
    const { name, email, password } = value;
    const exists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashed]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
  console.error("SIGNUP ERROR:", error);
  res.status(500).json({
    message: "Signup failed",
    error: error.message,
  });
}

};
const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
export const signin = async (req, res) => {
  try {
    const value = await loginSchema.validateAsync(req.body);
    const { email, password } = value;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
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
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
