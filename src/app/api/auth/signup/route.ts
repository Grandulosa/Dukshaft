import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { signupSchema } from "@/lib/validations/auth"
import { signToken, setAuthCookie } from "@/lib/auth"
import { generateVerificationCode, hashToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = signupSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, email, password } = result.data

    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const verificationCode = generateVerificationCode()

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: hashToken(verificationCode),
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })

    try {
      await sendVerificationEmail(email, verificationCode)
    } catch (err) {
      console.error("[signup] Email delivery failed:", err)
    }

    const token = await signToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    })

    const response = NextResponse.json(
      { message: "Account created. Check your email to verify your address." },
      { status: 201 }
    )
    setAuthCookie(response, token)
    return response
  } catch (err) {
    console.error("[signup]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
