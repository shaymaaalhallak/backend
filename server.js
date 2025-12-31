require("dotenv").config();

console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log("EMAIL PASS LENGTH:", process.env.EMAIL_PASS?.length);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✓ Set" : "✗ NOT SET");

const express = require("express");
const cors = require("cors");
const db = require("./db");
const { sendContactEmail } = require("./utils/mailer");

// Test database connection on startup
db.query("SELECT NOW()")
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully!");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL Connection Failed:", err.message);
  });

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://ugliest-mailbox.surge.sh"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require("path");

app.use("/assets", express.static(path.join(__dirname, "assets")));

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/contact", require("./routes/contact"));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
