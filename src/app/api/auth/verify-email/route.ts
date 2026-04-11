import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { hashToken } from "@/lib/token"
import { getSession, signToken, setAuthCookie } from "@/lib/auth"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code } = await request.json()
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({
      _id: session.sub,
      emailVerificationToken: hashToken(code.trim()),
      emailVerificationExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      )
    }

    user.emailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationExpires = null
    await user.save()

    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("[verify-email] Welcome email failed:", err)
    )

    // Re-issue the JWT with emailVerified: true so the cookie reflects the update
    const newToken = await signToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      emailVerified: true,
    })

    const response = NextResponse.json({ message: "Email verified successfully." })
    setAuthCookie(response, newToken)
    return response
  } catch (err) {
    console.error("[verify-email]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
