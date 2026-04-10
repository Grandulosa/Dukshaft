import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(session.sub).select(
      "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires"
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error("[me]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
