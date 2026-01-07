const express = require("express");
const pool = require("../../db");
const auth = require("../../middleware/auth");
const adminOnly = require("../../middleware/adminOnly");

const router = express.Router();

/* GET AUTHORS (PAGINATED) */
router.get("/", auth, adminOnly, async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT *
    FROM authors
    ORDER BY id DESC
    LIMIT $1 OFFSET $2
  `;

  const countQuery = `SELECT COUNT(*) FROM authors`;

  const [dataRes, countRes] = await Promise.all([
    pool.query(dataQuery, [limit, offset]),
    pool.query(countQuery),
  ]);

  res.json({
    data: dataRes.rows,
    total: Number(countRes.rows[0].count),
  });
});


/* CREATE AUTHOR */
router.post("/", auth, adminOnly, async (req, res) => {
  const { name, biography, photo_url, birth_date, nationality } = req.body;

  const { rows } = await pool.query(
    `
    INSERT INTO authors (name, biography, photo_url, birth_date, nationality)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [name, biography, photo_url, birth_date, nationality]
  );

  res.json(rows[0]);
});

/* UPDATE AUTHOR */
router.put("/:id", auth, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { name, biography, photo_url, birth_date, nationality } = req.body;

  const { rows } = await pool.query(
    `
    UPDATE authors
    SET name=$1, biography=$2, photo_url=$3, birth_date=$4, nationality=$5
    WHERE id=$6
    RETURNING *
    `,
    [name, biography, photo_url, birth_date, nationality, id]
  );

  res.json(rows[0]);
});

/* DELETE AUTHOR */
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await pool.query("DELETE FROM authors WHERE id=$1", [req.params.id]);
  res.json({ message: "Author deleted" });
});

module.exports = router;
