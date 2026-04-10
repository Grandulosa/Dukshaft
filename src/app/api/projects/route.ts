import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Project from "@/models/Project"
import {
  createProjectSchema,
  projectQuerySchema,
} from "@/lib/validations/project"

export const dynamic = "force-dynamic"

// GET /api/projects — paginated list, scoped to the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const rawParams = Object.fromEntries(request.nextUrl.searchParams)
    const parsed = projectQuerySchema.safeParse(rawParams)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { page, limit, status, search, sort } = parsed.data
    const skip = (page - 1) * limit

    // Base filter — always exclude soft-deleted records
    const filter: Record<string, unknown> = {
      owner: session.sub,
      deletedAt: null,
    }
    if (status) filter.status = status

    // Full-text search when provided, otherwise sort by chosen field
    let queryBase = search
      ? Project.find({ ...filter, $text: { $search: search } })
      : Project.find(filter)

    // Total count (before pagination)
    const total = await Project.countDocuments(
      search ? { ...filter, $text: { $search: search } } : filter
    )

    // Sort — leading "-" means descending
    const sortField = sort.startsWith("-") ? sort.slice(1) : sort
    const sortOrder = sort.startsWith("-") ? -1 : 1

    const projects = await queryBase
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json(
      {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("[projects GET]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/projects — create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const result = createProjectSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    await connectDB()
    const project = await Project.create({
      ...result.data,
      owner: session.sub,
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (err) {
    console.error("[projects POST]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
