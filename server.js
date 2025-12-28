require("dotenv").config();

console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log("EMAIL PASS LENGTH:", process.env.EMAIL_PASS?.length);
const express = require("express");
const cors = require("cors");
const { sendContactEmail } = require("./utils/mailer");

sendContactEmail("Test User", "test@example.com", "Test message")
  .then(() => console.log("✅ Email test success"))
  .catch((err) => console.error("❌ Email test failed", err));

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require("path");

app.use("/assets", express.static(path.join(__dirname, "assets")));

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/contact", require("./routes/contact"));

app.get("/api/books", (req, res) => {
  res.json(books);
});

// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
