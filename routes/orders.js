const express = require("express");
const router = express.Router();
const db = require("../db");
const { sendOrderEmail } = require("../utils/mailer");

// PLACE ORDER
router.post("/", (req, res) => {
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

  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction start error:", err);
      return res.status(500).json({ error: "Transaction error" });
    }

    const orderSql = `
      INSERT INTO orders (name, email, phone, address, delivery_type, total)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      orderSql,
      [name, email, phone, address, deliveryType, total],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Order insert error:", err);
            res.status(500).json({ error: "Failed to create order" });
          });
        }

        const orderId = result.insertId;

        const itemPromises = cart.map((item) => {
          return new Promise((resolve, reject) => {
            if (!item.book_id) {
              return reject(new Error("Invalid book_id"));
            }

            db.query(
              `INSERT INTO order_items (order_id, book_id, quantity, price)
               VALUES (?, ?, ?, ?)`,
              [orderId, item.book_id, Number(item.qty), Number(item.price)],
              (err) => {
                if (err) return reject(err);
                resolve();
              }
            );
          });
        });

        Promise.all(itemPromises)
          .then(async () => {
            db.commit(async (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Commit error:", err);
                  res.status(500).json({ error: "Commit failed" });
                });
              }

              try {
                await sendOrderEmail(email, orderId, total);
              } catch (emailErr) {
                console.error("Email failed:", emailErr);
              }

              res.json({ success: true, orderId });
            });
          })
          .catch((err) => {
            db.rollback(() => {
              console.error("Order item insert error:", err);
              res.status(500).json({ error: "Failed to save order items" });
            });
          });
      }
    );
  });
});

module.exports = router;
