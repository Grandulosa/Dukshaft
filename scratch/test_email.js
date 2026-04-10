const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env.local" });

async function test() {
  console.log("Testing SMTP connection with settings:");
  console.log("- Host:", process.env.SMTP_HOST);
  console.log("- User:", process.env.SMTP_USER);
  console.log("- From:", process.env.EMAIL_FROM);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Connection success! SMTP is configured correctly.");
  } catch (err) {
    console.error("❌ Connection failed!");
    console.error(err);
  }
}

test();
