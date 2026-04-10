import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { loginSchema } from "@/lib/validations/auth"
import { signToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = result.data

    await connectDB()

    const user = await User.findOne({ email })
    // Constant-time-ish: always compare even if user not found to prevent timing attacks
    const dummyHash = "$2a$12$invalidhashfortimingprotection000000000000000000000000"
    const isValid = await bcrypt.compare(password, user?.password ?? dummyHash)

    if (!user || !isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = await signToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    })

    const response = NextResponse.json({ message: "Logged in" }, { status: 200 })
    setAuthCookie(response, token)
    return response
  } catch (err) {
    console.error("[login]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
