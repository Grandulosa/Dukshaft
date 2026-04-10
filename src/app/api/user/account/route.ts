import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getSession, clearAuthCookie } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { deleteAccountSchema } from "@/lib/validations/user"
import { deleteAvatar } from "@/lib/storage"

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const result = deleteAccountSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    await connectDB()
    const user = await User.findById(session.sub)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const isValid = await bcrypt.compare(result.data.password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Password is incorrect" }, { status: 400 })
    }

    if (user.avatarUrl) await deleteAvatar(user.avatarUrl)
    await user.deleteOne()

    const response = NextResponse.json({ message: "Account deleted" }, { status: 200 })
    clearAuthCookie(response)
    return response
  } catch (err) {
    console.error("[account DELETE]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
