import { z } from "zod"

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or fewer"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional(),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  tags: z
    .array(z.string().trim().max(30, "Each tag must be 30 characters or fewer"))
    .max(10, "Maximum 10 tags")
    .default([]),
})

export const updateProjectSchema = createProjectSchema.partial().refine(
  (d) => Object.keys(d).length > 0,
  { message: "At least one field is required" }
)

export const projectQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => Math.max(1, parseInt(v ?? "1", 10) || 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => Math.min(50, Math.max(1, parseInt(v ?? "20", 10) || 20))),
  status: z.enum(["active", "draft", "archived"]).optional(),
  search: z.string().max(100).optional(),
  sort: z
    .enum(["createdAt", "-createdAt", "title", "-title"])
    .optional()
    .default("-createdAt"),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type ProjectQuery = z.infer<typeof projectQuerySchema>
