const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= GET MY BOOKS ================= */
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;
  const { shelf, q } = req.query;

  const params = [userId];
  let where = "bb.user_id = $1";

  if (shelf && shelf !== "all") {
    params.push(shelf);
    where += ` AND bs.shelf_type = $${params.length}`;
  }

  if (q) {
    params.push(`%${q}%`);
    where += ` AND b.title ILIKE $${params.length}`;
  }

  const query = `
    SELECT
      b.id,
      b.title,
      b.cover_image_url,
      a.name AS author,
      COALESCE(r.rating, 0) AS rating,
      b.avg_rating,
      MIN(bb.added_at) AS added_at,
      ARRAY_AGG(DISTINCT bs.shelf_type) AS shelves,
      r.review_text AS review
    FROM bookshelf_books bb
    JOIN books b ON b.id = bb.book_id
    JOIN authors a ON a.id = b.author_id
    JOIN bookshelves bs ON bs.id = bb.bookshelf_id
    LEFT JOIN reviews r ON r.book_id = b.id AND r.user_id = $1
    WHERE ${where}
    GROUP BY b.id, a.name, r.rating, r.review_text
    ORDER BY added_at DESC
  `;

  const { rows } = await pool.query(query, params);
  res.json(rows);
});

/* ================= GET ALL SHELVES (DEFAULT + CUSTOM) ================= */
router.get("/shelves", auth, async (req, res) => {
  const { rows } = await pool.query(
    `
    SELECT
      bs.id,
      bs.shelf_type AS key,
      bs.name AS label,
      COUNT(bb.id)::int AS count
    FROM bookshelves bs
    LEFT JOIN bookshelf_books bb ON bb.bookshelf_id = bs.id
    WHERE bs.user_id = $1
    GROUP BY bs.id
    ORDER BY bs.is_default DESC, bs.created_at ASC
    `,
    [req.user.id]
  );

  res.json(rows);
});

/* ================= CREATE CUSTOM SHELF ================= */
router.post("/shelves", auth, async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Shelf name required" });
  }

  // ✅ slugify name → shelf_type
  const shelfType = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  const { rows } = await pool.query(
    `
    INSERT INTO bookshelves (user_id, name, shelf_type, is_default)
    VALUES ($1, $2, $3, FALSE)
    RETURNING *
    `,
    [req.user.id, name.trim(), shelfType]
  );

  res.json(rows[0]);
});

/* ================= UPDATE BOOK (rating, review, shelves) ================= */
router.put("/:id", auth, async (req, res) => {
  const bookId = Number(req.params.id);
  const userId = req.user.id;

  if (!Number.isInteger(bookId)) {
    return res.status(400).json({ message: "Invalid book id" });
  }

let { rating, review, shelves } = req.body;


if (rating === "" || rating === undefined) {
  rating = null;
} else {
  rating = Number(rating);
  if (isNaN(rating) || rating < 0 || rating > 5) {
    return res.status(400).json({ message: "Invalid rating" });
  }
}

  if (!Array.isArray(shelves)) shelves = [];

  try {
    await pool.query("BEGIN");

    /* ---- REVIEW ---- */
    if (rating !== undefined || review !== undefined) {
      await pool.query(
        `
        INSERT INTO reviews (user_id, book_id, rating, review_text)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (user_id, book_id)
        DO UPDATE SET
          rating = EXCLUDED.rating,
          review_text = EXCLUDED.review_text
        `,
        [userId, bookId, rating ?? null, review ?? null]
      );
    }

    /* ---- SHELVES ---- */
    await pool.query(
      `DELETE FROM bookshelf_books WHERE user_id=$1 AND book_id=$2`,
      [userId, bookId]
    );

    if (shelves.length) {
      const shelfRows = await pool.query(
        `
        SELECT id
        FROM bookshelves
        WHERE user_id = $1
          AND shelf_type = ANY($2::text[])
        `,
        [userId, shelves]
      );

      for (const s of shelfRows.rows) {
        await pool.query(
          `
          INSERT INTO bookshelf_books (bookshelf_id, book_id, user_id)
          VALUES ($1,$2,$3)
          `,
          [s.id, bookId, userId]
        );
      }
    }

    await pool.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ================= DELETE BOOK ================= */
router.delete("/:id", auth, async (req, res) => {
  const bookId = Number(req.params.id);
  const userId = req.user.id;

  await pool.query(
    `DELETE FROM bookshelf_books WHERE user_id=$1 AND book_id=$2`,
    [userId, bookId]
  );

  await pool.query(
    `DELETE FROM reviews WHERE user_id=$1 AND book_id=$2`,
    [userId, bookId]
  );

  res.json({ success: true });
});

/* ================= DELETE SHELVES (BULK) ================= */
router.delete("/shelves", auth, async (req, res) => {
  const userId = req.user.id;
  const { shelfIds } = req.body;

  if (!Array.isArray(shelfIds) || !shelfIds.length) {
    return res.status(400).json({ message: "No shelves selected" });
  }

  try {
    await pool.query("BEGIN");

    // Remove books from these shelves
    await pool.query(
      `
      DELETE FROM bookshelf_books
      WHERE bookshelf_id = ANY($1)
        AND user_id = $2
      `,
      [shelfIds, userId]
    );

    // Delete shelves (custom only)
    await pool.query(
      `
      DELETE FROM bookshelves
      WHERE id = ANY($1)
        AND user_id = $2
        AND is_default = FALSE
      `,
      [shelfIds, userId]
    );

    await pool.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed to delete shelves" });
  }
});

/* ================= RENAME SHELF ================= */
router.put("/shelves/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const shelfId = Number(req.params.id);
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name required" });
  }

  await pool.query(
    `
    UPDATE bookshelves
    SET name = $1
    WHERE id = $2
      AND user_id = $3
      AND is_default = FALSE
    `,
    [name.trim(), shelfId, userId]
  );

  res.json({ success: true });
});


module.exports = router;
