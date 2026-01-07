const express = require("express");
const pool = require("../../db");
const auth = require("../../middleware/auth");
const adminOnly = require("../../middleware/adminOnly");

const router = express.Router();

router.get("/", auth, adminOnly, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name FROM categories ORDER BY name"
  );
  res.json(rows);
});

module.exports = router;
