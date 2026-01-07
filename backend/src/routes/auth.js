const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const { signToken } = require("../utils/jwt");
const auth = require("../middleware/auth");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, password)
       VALUES ($1,$2,$3)
       RETURNING id, email, full_name, role`,
      [name, email, hash]
    );

    const token = signToken(rows[0]);

    res
      .cookie("token", {
        httpOnly: true,
        sameSite: "lax",
      })
      .json({ user: rows[0] });
  } catch {
    res.status(400).json({ message: "Email already exists" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  const user = rows[0];
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);

  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    })
    .json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
});

/* CURRENT USER */
router.get("/me", auth, async (req, res) => {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      email,
      full_name,
      role,
      avatar_url,
      bio,
      created_at
    FROM users
    WHERE id=$1
    `,
    [req.user.id]
  );

  res.json(rows[0]);
});

/* LOGOUT */
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

module.exports = router;
