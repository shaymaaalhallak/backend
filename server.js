require("dotenv").config();

console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log("EMAIL PASS LENGTH:", process.env.EMAIL_PASS?.length);
const express = require("express");
const cors = require("cors");
const { sendContactEmail } = require("./utils/mailer");

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://wry-ants.surge.sh"],
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
