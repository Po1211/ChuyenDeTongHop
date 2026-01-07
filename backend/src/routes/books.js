const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const authOptional = require("../middleware/authOptional");

const router = express.Router();

/* ================= SEARCH BOOKS ================= */
router.get("/search", async (req, res) => {
  const { q = "", type = "all" } = req.query;

  if (!q.trim()) {
    return res.json([]);
  }

  let whereClause = "";
  let values = [];

  if (type === "title") {
    whereClause = "b.title ILIKE $1";
    values = [`%${q}%`];
  } else if (type === "author") {
    whereClause = "a.name ILIKE $1";
    values = [`%${q}%`];
  } else {
    // all
    whereClause = "(b.title ILIKE $1 OR a.name ILIKE $1)";
    values = [`%${q}%`];
  }

  try {
    const result = await pool.query(
      `
  SELECT
    b.id,
    b.title,
    b.cover_image_url,
    b.publication_year,
    a.name AS author,
    b.avg_rating AS rating,
    b.total_reviews AS votes
  FROM books b
  JOIN authors a ON b.author_id = a.id
  WHERE ${whereClause}
  ORDER BY b.total_reviews DESC
  LIMIT 50
  `,
      values
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
});

/* ================= GET BOOK DETAILS ================= */
router.get("/:id", authOptional, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user ? req.user.id : null;

    const bookQuery = `
      SELECT 
        b.*,
        a.name AS author_name,
        a.biography AS author_bio,
        a.photo_url AS author_photo,
        ARRAY_REMOVE(ARRAY_AGG(c.name), NULL) AS categories,
        EXISTS (
          SELECT 1
          FROM bookshelf_books bb
          JOIN bookshelves bs ON bs.id = bb.bookshelf_id
          WHERE bb.book_id = b.id
            AND bs.user_id = $2
            AND bs.shelf_type = 'want_to_read'
        ) AS is_want_to_read
      FROM books b
      JOIN authors a ON b.author_id = a.id
      LEFT JOIN book_categories bc ON bc.book_id = b.id
      LEFT JOIN categories c ON c.id = bc.category_id
      WHERE b.id = $1
      GROUP BY b.id, a.id
    `;

    const { rows } = await pool.query(bookQuery, [bookId, userId]);

    if (!rows.length) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load book" });
  }
});

/* ================= GET REVIEWS (PAGINATED) ================= */
router.get("/:id/reviews", async (req, res) => {
  const bookId = req.params.id;
  const page = Number(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const reviewsQuery = `
    SELECT r.*, u.full_name, u.avatar_url
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.book_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const countQuery = `
    SELECT COUNT(*) FROM reviews WHERE book_id = $1
  `;

  const [reviewsRes, countRes] = await Promise.all([
    pool.query(reviewsQuery, [bookId, limit, offset]),
    pool.query(countQuery, [bookId]),
  ]);

  const total = Number(countRes.rows[0].count);
  const hasMore = offset + limit < total;

  res.json({
    reviews: reviewsRes.rows,
    hasMore,
  });
});

/* ================= ADD REVIEW ================= */
router.post("/:id/reviews", auth, async (req, res) => {
  const { rating, review_text } = req.body;

  const { rows } = await pool.query(
    `
    INSERT INTO reviews (user_id, book_id, rating, review_text)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [req.user.id, req.params.id, rating, review_text]
  );

  res.json(rows[0]);
});

/* ================= EDIT REVIEW ================= */
router.put("/reviews/:reviewId", auth, async (req, res) => {
  const { reviewId } = req.params;
  const { rating, review_text } = req.body;

  const { rowCount } = await pool.query(
    `
    UPDATE reviews
    SET rating = $1, review_text = $2
    WHERE id = $3 AND user_id = $4
    `,
    [rating, review_text, reviewId, req.user.id]
  );

  if (!rowCount) return res.sendStatus(403);

  res.json({ message: "Updated" });
});

/* ================= DELETE REVIEW ================= */
router.delete("/reviews/:reviewId", auth, async (req, res) => {
  const { reviewId } = req.params;

  const { rows } = await pool.query(
    "SELECT user_id FROM reviews WHERE id = $1",
    [reviewId]
  );

  if (!rows.length) return res.sendStatus(404);

  if (rows[0].user_id !== req.user.id && req.user.role !== "admin") {
    return res.sendStatus(403);
  }

  await pool.query("DELETE FROM reviews WHERE id = $1", [reviewId]);

  res.json({ message: "Deleted" });
});

/* ================= ADD TO WANT TO READ ================= */
router.post("/:id/want-to-read", auth, async (req, res) => {
  let shelf = await pool.query(
    `
    SELECT id FROM bookshelves
    WHERE user_id = $1 AND shelf_type = 'want_to_read'
    `,
    [req.user.id]
  );

  if (!shelf.rows.length) {
    shelf = await pool.query(
      `
      INSERT INTO bookshelves (user_id, shelf_type)
      VALUES ($1, 'want_to_read')
      RETURNING id
      `,
      [req.user.id]
    );
  }

  await pool.query(
    `
    INSERT INTO bookshelf_books (bookshelf_id, book_id, user_id)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING
    `,
    [shelf.rows[0].id, req.params.id, req.user.id]
  );

  res.json({ message: "Added to Want to Read" });
});

/* ================= REMOVE FROM WANT TO READ ================= */
router.delete("/:id/want-to-read", auth, async (req, res) => {
  const shelf = await pool.query(
    `
    SELECT id FROM bookshelves
    WHERE user_id = $1 AND shelf_type = 'want_to_read'
    `,
    [req.user.id]
  );

  if (!shelf.rows.length) {
    return res.json({ message: "Already removed" });
  }

  await pool.query(
    `
    DELETE FROM bookshelf_books
    WHERE bookshelf_id = $1 AND book_id = $2
    `,
    [shelf.rows[0].id, req.params.id]
  );

  res.json({ message: "Removed from Want to Read" });
});

/* ================= CHANGE BOOK STATUS (FIXED) ================= */
router.put("/:id/status", auth, async (req, res) => {
  const bookId = req.params.id;
  const { shelf_type } = req.body;

  if (!["want_to_read", "reading", "read"].includes(shelf_type)) {
    return res.status(400).json({ message: "Invalid shelf type" });
  }

  try {
    // Remove from all default shelves (FIXED SQL)
    await pool.query(
      `
      DELETE FROM bookshelf_books
      WHERE user_id = $1
        AND book_id = $2
        AND bookshelf_id IN (
          SELECT id
          FROM bookshelves
          WHERE user_id = $1
            AND shelf_type IN ('want_to_read', 'reading', 'read')
        )
      `,
      [req.user.id, bookId]
    );

    // Insert into selected shelf
    await pool.query(
      `
      INSERT INTO bookshelf_books (bookshelf_id, book_id, user_id, added_at)
      SELECT id, $2, $1, NOW()
      FROM bookshelves
      WHERE user_id = $1
        AND shelf_type = $3
      `,
      [req.user.id, bookId, shelf_type]
    );

    res.json({ shelf_type });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
