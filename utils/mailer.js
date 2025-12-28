const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ORDER CONFIRMATION EMAIL (TO CUSTOMER)
async function sendOrderEmail(customerEmail, orderId, total) {
  return transporter.sendMail({
    from: `"Book Store" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: "📦 Order Confirmation - Book Store",
    text: `
Thank you for your order!

Order ID: ${orderId}
Total Amount: $${total}

📚 Book Store Team
`,
  });
}

// CONTACT FORM AUTO-REPLY (TO USER)
async function sendContactEmail(name, email, message) {
  return transporter.sendMail({
    from: `"Book Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "📩 We received your message",
    text: `
Hi ${name},

Thank you for contacting Book Store!
We have received your message:

"${message}"

Our team will get back to you shortly.

📚 Book Store Team
`,
  });
}

module.exports = {
  sendOrderEmail,
  sendContactEmail,
};
