import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { getSession } from "@/lib/auth"
import { generateVerificationCode, hashToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/email"

const RESEND_COOLDOWN_MS = 60_000 // 1 minute between resends

export async function POST() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(session.sub)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      )
    }

    // Rate limit: if a token was issued within the last minute, reject
    const cooldownThreshold = Date.now() + 24 * 60 * 60 * 1000 - RESEND_COOLDOWN_MS
    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires.getTime() > cooldownThreshold
    ) {
      return NextResponse.json(
        { error: "Please wait a minute before requesting another code." },
        { status: 429 }
      )
    }

    const verificationCode = generateVerificationCode()
    const hashedToken = hashToken(verificationCode)
    const newExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Send the email BEFORE writing to DB — if delivery fails, the old code
    // remains valid and the cooldown window is not consumed.
    try {
      await sendVerificationEmail(user.email, verificationCode)
    } catch (err) {
      console.error("[resend-verification] Email delivery failed:", err)
      return NextResponse.json(
        { error: "Failed to send the email. Please try again in a moment." },
        { status: 503 }
      )
    }

    user.emailVerificationToken = hashedToken
    user.emailVerificationExpires = newExpires
    await user.save()

    return NextResponse.json({ message: "Verification email sent." })
  } catch (err) {
    console.error("[resend-verification]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
