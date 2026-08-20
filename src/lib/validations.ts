import { z } from "zod";

// ─── College Search / Filter ────────────────────────────────────

export const collegeSearchSchema = z.object({
  search: z.string().optional().default(""),
  state: z.string().optional(),
  city: z.string().optional(),
  stream: z.string().optional(),
  type: z.enum(["GOVERNMENT", "PRIVATE", "DEEMED", "AUTONOMOUS"]).optional(),
  minFees: z.coerce.number().int().min(0).optional(),
  maxFees: z.coerce.number().int().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z
    .enum(["rating_desc", "fees_asc", "fees_desc", "placement_desc", "name_asc"])
    .optional()
    .default("rating_desc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type CollegeSearchParams = z.infer<typeof collegeSearchSchema>;

// ─── Compare ────────────────────────────────────────────────────

export const compareSchema = z.object({
  ids: z
    .string()
    .transform((s) => s.split(",").filter(Boolean))
    .pipe(z.array(z.string()).min(2).max(3)),
});

// ─── Predictor ──────────────────────────────────────────────────

export const predictorSchema = z.object({
  exam: z.string().min(1, "Exam is required"),
  rank: z.coerce.number().int().min(1, "Rank must be at least 1").max(500000),
  category: z.enum(["General", "OBC", "SC", "ST", "EWS"]),
  course: z.string().min(1, "Course preference is required"),
  state: z.string().optional(),
  maxFees: z.coerce.number().int().min(0).optional(),
});

export type PredictorInput = z.infer<typeof predictorSchema>;

// ─── Review ─────────────────────────────────────────────────────

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000),
});

// ─── Auth ───────────────────────────────────────────────────────

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Saved College ──────────────────────────────────────────────

export const savedCollegeSchema = z.object({
  collegeId: z.string().min(1, "College ID is required"),
});
