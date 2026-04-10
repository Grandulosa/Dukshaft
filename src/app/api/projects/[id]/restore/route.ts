import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Project from "@/models/Project"

export const dynamic = "force-dynamic"

// POST /api/projects/[id]/restore — undo a soft delete
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    await connectDB()
    const project = await Project.findOneAndUpdate(
      { _id: params.id, owner: session.sub, deletedAt: { $ne: null } },
      { $set: { deletedAt: null } },
      { new: true }
    )

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or not deleted" },
        { status: 404 }
      )
    }

    return NextResponse.json({ project }, { status: 200 })
  } catch (err) {
    console.error("[project restore]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
