import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { changePasswordSchema } from "@/lib/validations/user"

export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const result = changePasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = result.data

    await connectDB()
    const user = await User.findById(session.sub)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    user.password = await bcrypt.hash(newPassword, 12)
    await user.save()

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 })
  } catch (err) {
    console.error("[password PATCH]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
