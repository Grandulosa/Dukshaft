import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { getSession } from "@/lib/auth"
import { generateVerificationCode, hashToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/email"

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

    const verificationCode = generateVerificationCode()
    user.emailVerificationToken = hashToken(verificationCode)
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await user.save()

    sendVerificationEmail(user.email, verificationCode).catch((err) =>
      console.error("[resend-verification] Email delivery failed:", err)
    )

    return NextResponse.json({ message: "Verification email sent." })
  } catch (err) {
    console.error("[resend-verification]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
