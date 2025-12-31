const express = require("express");
const router = express.Router();
const db = require("../db");
const { sendOrderEmail } = require("../utils/mailer");

// PLACE ORDER
router.post("/", async (req, res) => {
  const { customer, cart, total } = req.body;

  if (!customer || !cart || !total) {
    return res
      .status(400)
      .json({ error: "Customer, cart, and total are required" });
  }

  const { name, email, phone, address, deliveryType } = customer;

  if (!name || !email || !phone || !address || !deliveryType) {
    return res.status(400).json({ error: "All customer fields are required" });
  }

  try {
    // Start transaction using pg client
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // Insert order and return the id
      const orderResult = await client.query(
        `INSERT INTO orders (name, email, phone, address, delivery_type, total)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [name, email, phone, address, deliveryType, total]
      );

      const orderId = orderResult.rows[0].id;

      // Insert order items
      for (const item of cart) {
        if (!item.book_id) throw new Error("Invalid book_id");
        await client.query(
          `INSERT INTO order_items (order_id, book_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.book_id, Number(item.qty), Number(item.price)]
        );
      }

      await client.query("COMMIT");

      // Send email (non-blocking)
      sendOrderEmail(email, orderId, total).catch(console.error);

      res.json({ success: true, orderId });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Order error:", err);
      res.status(500).json({ error: "Failed to create order" });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Transaction error:", err);
    res.status(500).json({ error: "Transaction error" });
  }
});

module.exports = router;
