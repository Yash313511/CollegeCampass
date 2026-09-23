export type CapCategory =
  | "GOPEN"
  | "LOPEN"
  | "GOBC"
  | "LOBC"
  | "GSC"
  | "LSC"
  | "GST"
  | "LST"
  | "GVJ"
  | "GNT1"
  | "GNT2"
  | "GNT3"
  | "EWS"
  | "TFWS"
  | "AI";

export type QuotaType = "HU" | "OHU" | "AI" | "ALL";

export type AdmissionChance = "Safe" | "Target" | "Dream" | "Reach";

export interface CapCutoffItem {
  id?: string;
  category: CapCategory | string;
  homeUniversityPercentile?: number | null;
  homeUniversityRank?: number | null;
  otherThanHomeUniversityPercentile?: number | null;
  otherThanHomeUniversityRank?: number | null;
  stateLevelPercentile?: number | null;
  stateLevelRank?: number | null;
  round: number;
  year: number;
}

export interface CapCourseItem {
  id: string;
  choiceCode: string;
  courseName: string;
  stream: string;
  intake: number;
  shift: string;
  status: string;
  capCollegeId: string;
  cutoffs?: CapCutoffItem[];
  // Calculated fields during search
  applicableCutoff?: number | null;
  applicableRank?: number | null;
  chance?: AdmissionChance;
}

export interface CapCollegeItem {
  id: string;
  collegeCode: string;
  name: string;
  slug: string;
  status: string; // e.g. "Government Autonomous", "Unaided Autonomous", "Unaided Private"
  region: string;
  district: string;
  university: string;
  address: string;
  establishedYear: number;
  website?: string | null;
  feesAnnual: number;
  avgPackage?: number | null;
  highestPackage?: number | null;
  rating: number;
  accreditation?: string | null;
  imageUrl?: string | null;
  courses: CapCourseItem[];
}

export interface CapPreferenceChoice {
  order: number;
  choiceCode: string;
  collegeCode: string;
  collegeName: string;
  courseName: string;
  status: string;
  feesAnnual: number;
  avgPackage?: number | null;
  cutoffPercentile: number;
  candidatePercentile: number;
  category: string;
  chance: AdmissionChance;
  notes?: string;
}

export interface CapFilterParams {
  percentile?: number;
  rank?: number;
  exam?: "MHT-CET" | "JEE Main";
  category?: string;
  genderQuota?: "General" | "Ladies";
  universityQuota?: "HU" | "OHU" | "AI";
  stream?: string;
  branchSearch?: string;
  collegeType?: string;
  search?: string;
  maxFees?: number;
  sort?: "cutoff_desc" | "cutoff_asc" | "rating_desc" | "fees_asc" | "package_desc";
  page?: number;
  limit?: number;
}

export interface CapSavedPreferenceList {
  id: string;
  title: string;
  candidateName: string;
  applicationId?: string;
  category: string;
  percentile: number;
  rank?: number;
  homeUniversity: string;
  round: string;
  items: CapPreferenceChoice[];
  createdAt: string;
  updatedAt: string;
}

export interface PdfExportOptions {
  candidateName: string;
  applicationId?: string;
  cetRollNo?: string;
  category: string;
  percentile: number;
  rank?: number;
  homeUniversity: string;
  round: string;
  items: CapPreferenceChoice[];
}
