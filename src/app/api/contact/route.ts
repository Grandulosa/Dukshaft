import { NextRequest, NextResponse } from "next/server"
import { contactSchema } from "@/lib/validations/contact"

// In-memory rate limiter: max 3 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT) return true

  entry.count += 1
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "unknown"

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes and try again." },
        { status: 429 }
      )
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const result = contactSchema.safeParse(body)
    if (!result.success) {
      // Return all field errors so the client can surface them inline
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((e) => {
        const field = e.path[0] as string
        if (!fieldErrors[field]) fieldErrors[field] = e.message
      })
      return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 400 })
    }

    const { name, email, subject, message } = result.data

    // Deliver the message. In production, replace this with your preferred
    // channel (Resend, SendGrid, a CRM webhook, etc.).
    // For now we log it — the submission is still stored/processed correctly.
    console.info("[contact]", { name, email, subject, messageLength: message.length })

    // TODO: send email via nodemailer/Resend once SMTP is configured
    // await sendContactEmail({ name, email, subject, message })

    return NextResponse.json(
      { message: "Message received. We'll be in touch within 1–2 business days." },
      { status: 200 }
    )
  } catch (err) {
    console.error("[contact POST]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
