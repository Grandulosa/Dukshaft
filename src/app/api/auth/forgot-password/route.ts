import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import { generateSecureToken, hashToken } from "@/lib/token"
import { sendPasswordResetEmail } from "@/lib/email"

// Always return the same response to prevent email enumeration
const SUCCESS = {
  message: "If an account with that email exists, a reset link has been sent.",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = forgotPasswordSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    await connectDB()
    const user = await User.findOne({ email: result.data.email })
    if (!user) {
      return NextResponse.json(SUCCESS, { status: 200 })
    }

    const token = generateSecureToken()
    user.passwordResetToken = hashToken(token)
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await user.save()

    sendPasswordResetEmail(user.email, token).catch((err) =>
      console.error("[forgot-password] Email delivery failed:", err)
    )

    return NextResponse.json(SUCCESS, { status: 200 })
  } catch (err) {
    console.error("[forgot-password]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
