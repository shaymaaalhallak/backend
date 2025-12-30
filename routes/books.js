const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL BOOKS
router.get("/", (req, res) => {
  const sql = "SELECT * FROM books ORDER BY id";
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    // Prepend full URL to each book image
    const booksWithFullImage = result.map((book) => ({
      ...book,
      image: `${BACKEND_URL}/assets/${book.image}`,
    }));

    res.json(booksWithFullImage);
  });
});

// GET SINGLE BOOK
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM books WHERE id = ?";
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result[0]) return res.status(404).json({ message: "Book not found" });

    const bookWithFullImage = {
      ...result[0],
      image: `${BACKEND_URL}/assets/${result[0].image}`,
    };

    res.json(bookWithFullImage);
  });
});

module.exports = router;
