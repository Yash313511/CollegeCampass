import { CollegeType } from "@prisma/client";

// ─── API Response Types ─────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: string;
  details?: Array<{ field: string; message: string }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── College ────────────────────────────────────────────────────

export interface CollegeListItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: CollegeType;
  rating: number;
  reviewCount: number;
  feesMin: number;
  feesMax: number;
  avgPackage: number | null;
  highestPackage: number | null;
  placementRate: number | null;
  logoUrl: string | null;
  streams: string[];
}

export interface CollegeDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  type: CollegeType;
  establishedYear: number;
  affiliation: string;
  website: string | null;
  accreditation: string | null;
  rating: number;
  reviewCount: number;
  feesMin: number;
  feesMax: number;
  avgPackage: number | null;
  highestPackage: number | null;
  placementRate: number | null;
  logoUrl: string | null;
  imageUrl: string | null;
  courses: CourseItem[];
  reviews: ReviewItem[];
}

export interface CourseItem {
  id: string;
  name: string;
  slug: string;
  duration: string;
  stream: string;
  fees: number;
  eligibility: string | null;
}

export interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
}

// ─── Compare ────────────────────────────────────────────────────

export interface CompareCollege {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: CollegeType;
  establishedYear: number;
  affiliation: string;
  accreditation: string | null;
  rating: number;
  reviewCount: number;
  feesMin: number;
  feesMax: number;
  avgPackage: number | null;
  highestPackage: number | null;
  placementRate: number | null;
  courses: Array<{ name: string; fees: number; duration: string }>;
}

// ─── Predictor ──────────────────────────────────────────────────

export interface PredictionResult {
  college: CollegeListItem;
  matchScore: number;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  name: string;
  matched: boolean;
  detail: string;
  weight: number;
  score: number;
}

// ─── Saved Colleges ─────────────────────────────────────────────

export interface SavedCollegeItem {
  id: string;
  collegeId: string;
  college: CollegeListItem;
  createdAt: string;
}

// ─── Filter Options (for sidebar) ───────────────────────────────

export interface FilterOptions {
  states: string[];
  cities: string[];
  streams: string[];
  types: CollegeType[];
  exams: string[];
}

// ─── Scholarships ───────────────────────────────────────────────

export interface ScholarshipListItem {
  id: string;
  name: string;
  slug: string;
  provider: string;
  description: string;
  type: string;
  level: string;
  amount: string;
  eligibility: string;
  deadline: string | null;
  applicationLink: string | null;
  streams: string[];
  categories: string[];
}

