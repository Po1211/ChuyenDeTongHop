const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= PROFILE SUMMARY ================= */
router.get("/summary", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    /* ================= Shelf counts ================= */
    const { rows: counts } = await pool.query(
      `
      SELECT bs.shelf_type, COUNT(bb.id)::int AS count
      FROM bookshelves bs
      LEFT JOIN bookshelf_books bb ON bb.bookshelf_id = bs.id
      WHERE bs.user_id = $1
        AND bs.shelf_type IN ('read','reading','want_to_read')
      GROUP BY bs.shelf_type
      `,
      [userId]
    );

    const shelf_counts = { read: 0, reading: 0, want_to_read: 0 };
    counts.forEach(r => {
      shelf_counts[r.shelf_type] = r.count;
    });

    /* ================= Custom shelves ================= */
    const { rows: custom_shelves } = await pool.query(
      `
      SELECT bs.id, bs.name, COUNT(bb.id)::int AS count
      FROM bookshelves bs
      LEFT JOIN bookshelf_books bb ON bb.bookshelf_id = bs.id
      WHERE bs.user_id = $1 AND bs.is_default = FALSE
      GROUP BY bs.id
      ORDER BY bs.created_at DESC
      `,
      [userId]
    );

    /* ================= Currently Reading (MAX 2) ================= */
    const { rows: currentlyReading } = await pool.query(
      `
      SELECT
        b.id AS book_id,
        b.title,
        b.cover_image_url,
        a.name AS author_name,
        bb.added_at,
        'reading' AS shelf_type,
        'Currently Reading' AS shelf_label
      FROM bookshelf_books bb
      JOIN bookshelves bs ON bs.id = bb.bookshelf_id
      JOIN books b ON b.id = bb.book_id
      JOIN authors a ON a.id = b.author_id
      WHERE bs.user_id = $1
        AND bs.shelf_type = 'reading'
      ORDER BY bb.added_at DESC
      LIMIT 2
      `,
      [userId]
    );

    /* ================= Shelf activity ================= */
    const { rows: shelfActivity } = await pool.query(
      `
      SELECT
        bb.book_id,
        b.title,
        b.cover_image_url,
        a.name AS author_name,
        bb.added_at AS time,
        bs.shelf_type,
        CASE bs.shelf_type
          WHEN 'want_to_read' THEN 'wants to read'
          WHEN 'reading' THEN 'is currently reading'
          WHEN 'read' THEN 'finished reading'
        END AS action,
        CASE bs.shelf_type
          WHEN 'want_to_read' THEN 'Want to Read'
          WHEN 'reading' THEN 'Currently Reading'
          WHEN 'read' THEN 'Read'
        END AS shelf_label
      FROM bookshelf_books bb
      JOIN bookshelves bs ON bs.id = bb.bookshelf_id
      JOIN books b ON b.id = bb.book_id
      JOIN authors a ON a.id = b.author_id
      WHERE bb.user_id = $1
      `,
      [userId]
    );

    /* ================= Review activity ================= */
    const { rows: reviewActivity } = await pool.query(
      `
      SELECT
        r.book_id,
        b.title,
        b.cover_image_url,
        a.name AS author_name,
        r.created_at AS time,
        'rated ★' || r.rating AS action,
        NULL AS shelf_type,
        NULL AS shelf_label
      FROM reviews r
      JOIN books b ON b.id = r.book_id
      JOIN authors a ON a.id = b.author_id
      WHERE r.user_id = $1
      `,
      [userId]
    );

    const recentActivity = [...shelfActivity, ...reviewActivity]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 2);

    /* ================= Favorite genres ================= */
    const { rows: favorite_genres } = await pool.query(
      `
      SELECT c.name
      FROM user_favorite_genres ufg
      JOIN categories c ON c.id = ufg.category_id
      WHERE ufg.user_id = $1
      ORDER BY c.name
      `,
      [userId]
    );

    res.json({
      shelf_counts,
      custom_shelves,
      currentlyReading,
      recentActivity,
      favorite_genres: favorite_genres.map(g => g.name),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile summary failed" });
  }
});

module.exports = router;
