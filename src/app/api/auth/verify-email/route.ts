import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { hashToken } from "@/lib/token"
import { sendWelcomeEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  try {
    const token = request.nextUrl.searchParams.get("token")
    if (!token) {
      return NextResponse.redirect(`${APP_URL}/verify-email?error=missing_token`)
    }

    await connectDB()

    const user = await User.findOne({
      emailVerificationToken: hashToken(token),
      emailVerificationExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.redirect(`${APP_URL}/verify-email?error=invalid_token`)
    }

    user.emailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationExpires = null
    await user.save()

    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("[verify-email] Welcome email failed:", err)
    )

    return NextResponse.redirect(`${APP_URL}/verify-email?success=true`)
  } catch (err) {
    console.error("[verify-email]", err)
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    return NextResponse.redirect(`${APP_URL}/verify-email?error=server_error`)
  }
}
