// routes/books.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL BOOKS
router.get("/", (req, res) => {
  const sql = "SELECT * FROM books ORDER BY id";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET SINGLE BOOK
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM books WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result[0]) return res.status(404).json({ message: "Book not found" });

    res.json(result[0]);
  });
});

module.exports = router;
