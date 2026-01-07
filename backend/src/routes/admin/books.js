const express = require("express");
const pool = require("../../db");
const auth = require("../../middleware/auth");
const adminOnly = require("../../middleware/adminOnly");

const router = express.Router();

/* =====================================================
   GET BOOKS (PAGINATED + GENRE FILTER)
===================================================== */
router.get("/", auth, adminOnly, async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const genreId = req.query.genre ? Number(req.query.genre) : null;

  try {
    const dataQuery = `
      SELECT
        b.*,
        a.name AS author,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT c.name), NULL) AS genres,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT c.id), NULL) AS genre_ids
      FROM books b
      JOIN authors a ON b.author_id = a.id
      LEFT JOIN book_categories bc ON bc.book_id = b.id
      LEFT JOIN categories c ON c.id = bc.category_id
      ${genreId ? "WHERE bc.category_id = $3" : ""}
      GROUP BY b.id, a.id
      ORDER BY b.id DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT b.id)
      FROM books b
      LEFT JOIN book_categories bc ON bc.book_id = b.id
      ${genreId ? "WHERE bc.category_id = $1" : ""}
    `;

    const dataParams = genreId ? [limit, offset, genreId] : [limit, offset];

    const countParams = genreId ? [genreId] : [];

    const [dataRes, countRes] = await Promise.all([
      pool.query(dataQuery, dataParams),
      pool.query(countQuery, countParams),
    ]);

    res.json({
      data: dataRes.rows.map((b) => ({
        ...b,
        genres: b.genres || [],
        genres_ids: b.genre_ids || [],
      })),
      total: Number(countRes.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load books" });
  }
});

/* =====================================================
   CREATE BOOK (WITH GENRES)
===================================================== */
router.post("/", auth, adminOnly, async (req, res) => {
  const {
    isbn,
    title,
    author_id,
    description,
    cover_image_url,
    publication_year,
    publisher,
    total_pages,
    language,
    genres = [],
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `
      INSERT INTO books
      (isbn, title, author_id, description, cover_image_url,
       publication_year, publisher, total_pages, language)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
      `,
      [
        isbn,
        title,
        author_id,
        description,
        cover_image_url,
        publication_year,
        publisher,
        total_pages,
        language,
      ]
    );

    const bookId = rows[0].id;

    for (const categoryId of genres) {
      await client.query(
        `
        INSERT INTO book_categories (book_id, category_id)
        VALUES ($1,$2)
        `,
        [bookId, categoryId]
      );
    }

    await client.query("COMMIT");
    res.json({ id: bookId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed to create book" });
  } finally {
    client.release();
  }
});

/* =====================================================
   UPDATE BOOK (WITH GENRES)
===================================================== */
router.put("/:id", auth, adminOnly, async (req, res) => {
  const bookId = Number(req.params.id);

  const {
    isbn,
    title,
    author_id,
    description,
    cover_image_url,
    publication_year,
    publisher,
    total_pages,
    language,
    genres = [],
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
      UPDATE books SET
        isbn=$1,
        title=$2,
        author_id=$3,
        description=$4,
        cover_image_url=$5,
        publication_year=$6,
        publisher=$7,
        total_pages=$8,
        language=$9
      WHERE id=$10
      `,
      [
        isbn,
        title,
        author_id,
        description,
        cover_image_url,
        publication_year,
        publisher,
        total_pages,
        language,
        bookId,
      ]
    );

    /* 🔴 RESET GENRES */
    await client.query(`DELETE FROM book_categories WHERE book_id=$1`, [
      bookId,
    ]);

    for (const categoryId of genres) {
      await client.query(
        `
        INSERT INTO book_categories (book_id, category_id)
        VALUES ($1,$2)
        `,
        [bookId, categoryId]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Book updated" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed to update book" });
  } finally {
    client.release();
  }
});

/* =====================================================
   DELETE BOOK (CLEANUP GENRES)
===================================================== */
router.delete("/:id", auth, adminOnly, async (req, res) => {
  const bookId = Number(req.params.id);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`DELETE FROM book_categories WHERE book_id=$1`, [
      bookId,
    ]);

    await client.query(`DELETE FROM books WHERE id=$1`, [bookId]);

    await client.query("COMMIT");
    res.json({ message: "Book deleted" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed to delete book" });
  } finally {
    client.release();
  }
});

module.exports = router;
