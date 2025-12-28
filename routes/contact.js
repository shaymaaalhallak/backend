const express = require("express");
const router = express.Router();
const db = require("../db");
const { sendContactEmail } = require("../utils/mailer");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `
    INSERT INTO contact_messages (name, email, message)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, email, message], async (err, result) => {
    if (err) {
      console.error("DB insert error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    try {
      await sendContactEmail(name, email, message);
    } catch (emailErr) {
      console.error("Contact email failed:", emailErr);
    }

    res.json({ success: true, insertedId: result.insertId });
  });
});

module.exports = router;
