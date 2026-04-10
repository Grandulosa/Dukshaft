import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Project from "@/models/Project"
import { updateProjectSchema } from "@/lib/validations/project"

export const dynamic = "force-dynamic"

type Params = { params: { id: string } }

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id)
}

// GET /api/projects/[id]
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    await connectDB()
    const project = await Project.findOne({
      _id: params.id,
      owner: session.sub,
      deletedAt: null,
    }).lean()

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project }, { status: 200 })
  } catch (err) {
    console.error("[project GET]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/projects/[id]
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const body = await request.json()
    const result = updateProjectSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    await connectDB()
    const project = await Project.findOneAndUpdate(
      { _id: params.id, owner: session.sub, deletedAt: null },
      { $set: result.data },
      { new: true, runValidators: true }
    ).lean()

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project }, { status: 200 })
  } catch (err) {
    console.error("[project PATCH]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/projects/[id] — soft delete (sets deletedAt timestamp)
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    await connectDB()
    const project = await Project.findOneAndUpdate(
      { _id: params.id, owner: session.sub, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    )

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted" }, { status: 200 })
  } catch (err) {
    console.error("[project DELETE]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
