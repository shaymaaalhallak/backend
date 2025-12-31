const express = require("express");
const router = express.Router();
const db = require("../db");
const { sendContactEmail } = require("../utils/mailer");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await db.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [name, email, message]
    );

    const insertedId = result.rows[0].id;

    // Send email (non-blocking)
    sendContactEmail(name, email, message).catch(console.error);

    res.json({ success: true, insertedId });
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
