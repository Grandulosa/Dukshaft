import nodemailer from "nodemailer"

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

const FROM = process.env.EMAIL_FROM ?? "noreply@dukshaft.studio"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export async function sendVerificationEmail(to: string, code: string): Promise<void> {
  await getTransporter().sendMail({
    from: FROM,
    to,
    subject: "Your verification code — Dukshaft Studio",
    html: `
      <p>Use the code below to verify your email address.</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:8px;">${code}</p>
      <p>This code expires in 24 hours. If you didn't create an account, ignore this email.</p>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const link = `${APP_URL}/reset-password?token=${token}`
  await getTransporter().sendMail({
    from: FROM,
    to,
    subject: "Reset your password — Dukshaft Studio",
    html: `
      <p>Click the link below to reset your password.</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    `,
  })
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await getTransporter().sendMail({
    from: FROM,
    to,
    subject: `Welcome to Dukshaft Studio, ${name}!`,
    html: `
      <p>Hi ${name},</p>
      <p>Your email has been verified. Welcome to Dukshaft Studio!</p>
      <p><a href="${APP_URL}/dashboard">Go to your dashboard →</a></p>
    `,
  })
}
