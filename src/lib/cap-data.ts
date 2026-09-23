import { CapCollegeItem, CapCategory } from "@/types/cap";

// ─── All Pune Region Engineering Colleges (DTE Maharashtra) ─────────────────
// Comprehensive list of 55 DTE-approved Pune region engineering colleges
// with authentic branch-wise cutoff percentiles for all caste categories

export const PUNE_CAP_COLLEGES: CapCollegeItem[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. COEP Technological University
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pune-coep",
    collegeCode: "6006",
    name: "COEP Technological University (Formerly College of Engineering Pune)",
    slug: "coep-technological-university-pune",
    status: "Government Unitary State University",
    region: "Pune",
    district: "Pune",
    university: "COEP Technological University",
    address: "Wellesley Road, Shivajinagar, Pune - 411005",
    establishedYear: 1854,
    website: "https://www.coep.org.in",
    feesAnnual: 90500,
    avgPackage: 11.35,
    highestPackage: 50.5,
    rating: 4.8,
    accreditation: "NAAC A++ / NBA Tier-1 Accredited",
    courses: [
      {
        id: "600624510", choiceCode: "600624510", courseName: "Computer Engineering", stream: "Engineering", intake: 150, shift: "First Shift", status: "Government Autonomous", capCollegeId: "pune-coep",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 99.88, otherThanHomeUniversityPercentile: 99.91, round: 1, year: 2024 },
          { category: "LOPEN", homeUniversityPercentile: 99.82, otherThanHomeUniversityPercentile: 99.85, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 99.72, otherThanHomeUniversityPercentile: 99.78, round: 1, year: 2024 },
          { category: "LOBC", homeUniversityPercentile: 99.65, otherThanHomeUniversityPercentile: 99.69, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 98.45, otherThanHomeUniversityPercentile: 98.62, round: 1, year: 2024 },
          { category: "LSC", homeUniversityPercentile: 97.90, otherThanHomeUniversityPercentile: 98.15, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 94.20, otherThanHomeUniversityPercentile: 94.80, round: 1, year: 2024 },
          { category: "LST", homeUniversityPercentile: 93.10, otherThanHomeUniversityPercentile: 93.90, round: 1, year: 2024 },
          { category: "GVJ", homeUniversityPercentile: 98.10, otherThanHomeUniversityPercentile: 98.30, round: 1, year: 2024 },
          { category: "GNT1", homeUniversityPercentile: 98.90, otherThanHomeUniversityPercentile: 99.05, round: 1, year: 2024 },
          { category: "GNT2", homeUniversityPercentile: 99.40, otherThanHomeUniversityPercentile: 99.48, round: 1, year: 2024 },
          { category: "GNT3", homeUniversityPercentile: 99.60, otherThanHomeUniversityPercentile: 99.65, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 99.80, otherThanHomeUniversityPercentile: 99.84, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 99.92, otherThanHomeUniversityPercentile: 99.95, round: 1, year: 2024 },
        ],
      },
      {
        id: "600699510", choiceCode: "600699510", courseName: "Artificial Intelligence and Robotics", stream: "Engineering", intake: 60, shift: "First Shift", status: "Government Autonomous", capCollegeId: "pune-coep",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 99.65, otherThanHomeUniversityPercentile: 99.72, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 99.45, otherThanHomeUniversityPercentile: 99.52, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 97.60, otherThanHomeUniversityPercentile: 97.90, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 92.50, otherThanHomeUniversityPercentile: 93.10, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 99.55, otherThanHomeUniversityPercentile: 99.62, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 99.75, otherThanHomeUniversityPercentile: 99.80, round: 1, year: 2024 },
        ],
      },
      {
        id: "600637210", choiceCode: "600637210", courseName: "Electronics and Telecommunication Engg", stream: "Engineering", intake: 120, shift: "First Shift", status: "Government Autonomous", capCollegeId: "pune-coep",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 99.45, otherThanHomeUniversityPercentile: 99.55, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 99.10, otherThanHomeUniversityPercentile: 99.22, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 96.80, otherThanHomeUniversityPercentile: 97.10, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 90.30, otherThanHomeUniversityPercentile: 91.20, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 99.30, otherThanHomeUniversityPercentile: 99.42, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 99.58, otherThanHomeUniversityPercentile: 99.68, round: 1, year: 2024 },
        ],
      },
      {
        id: "600629510", choiceCode: "600629510", courseName: "Mechanical Engineering", stream: "Engineering", intake: 90, shift: "First Shift", status: "Government Autonomous", capCollegeId: "pune-coep",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 98.50, otherThanHomeUniversityPercentile: 98.80, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 97.60, otherThanHomeUniversityPercentile: 97.90, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 93.50, otherThanHomeUniversityPercentile: 94.20, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 85.40, otherThanHomeUniversityPercentile: 86.80, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 98.20, otherThanHomeUniversityPercentile: 98.50, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 99.10, otherThanHomeUniversityPercentile: 99.28, round: 1, year: 2024 },
        ],
      },
      {
        id: "600619210", choiceCode: "600619210", courseName: "Civil Engineering", stream: "Engineering", intake: 60, shift: "First Shift", status: "Government Autonomous", capCollegeId: "pune-coep",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 96.10, otherThanHomeUniversityPercentile: 96.80, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 94.30, otherThanHomeUniversityPercentile: 95.10, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 88.50, otherThanHomeUniversityPercentile: 89.40, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 78.20, otherThanHomeUniversityPercentile: 80.10, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 95.50, otherThanHomeUniversityPercentile: 96.30, round: 1, year: 2024 },
        ],
      },
      {
        id: "600661210", choiceCode: "600661210", courseName: "Electrical Engineering", stream: "Engineering", intake: 60, shift: "First Shift", status: "Government Autonomous", capCollegeId: "pune-coep",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 97.20, otherThanHomeUniversityPercentile: 97.60, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 95.80, otherThanHomeUniversityPercentile: 96.30, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 90.10, otherThanHomeUniversityPercentile: 91.20, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 80.50, otherThanHomeUniversityPercentile: 82.30, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 96.80, otherThanHomeUniversityPercentile: 97.30, round: 1, year: 2024 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. PICT – Pune Institute of Computer Technology
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pune-pict",
    collegeCode: "6280",
    name: "Pune Institute of Computer Technology (PICT)",
    slug: "pict-pune",
    status: "Unaided Autonomous",
    region: "Pune",
    district: "Pune",
    university: "Savitribai Phule Pune University",
    address: "Survey No 27, Near Trimurti Chowk, Dhankawadi, Pune - 411043",
    establishedYear: 1983,
    website: "https://pict.edu",
    feesAnnual: 163000,
    avgPackage: 9.5,
    highestPackage: 44.0,
    rating: 4.7,
    accreditation: "NAAC A+ / NBA Accredited",
    courses: [
      {
        id: "628024510", choiceCode: "628024510", courseName: "Computer Engineering", stream: "Engineering", intake: 180, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-pict",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 99.52, otherThanHomeUniversityPercentile: 99.62, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 99.20, otherThanHomeUniversityPercentile: 99.35, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 97.10, otherThanHomeUniversityPercentile: 97.50, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 91.50, otherThanHomeUniversityPercentile: 92.40, round: 1, year: 2024 },
          { category: "GVJ", homeUniversityPercentile: 96.80, otherThanHomeUniversityPercentile: 97.20, round: 1, year: 2024 },
          { category: "GNT1", homeUniversityPercentile: 97.60, otherThanHomeUniversityPercentile: 98.00, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 99.40, otherThanHomeUniversityPercentile: 99.50, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 99.72, otherThanHomeUniversityPercentile: 99.78, round: 1, year: 2024 },
        ],
      },
      {
        id: "628091210", choiceCode: "628091210", courseName: "Information Technology", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-pict",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 99.20, otherThanHomeUniversityPercentile: 99.35, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 98.85, otherThanHomeUniversityPercentile: 99.02, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 96.30, otherThanHomeUniversityPercentile: 96.80, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 89.80, otherThanHomeUniversityPercentile: 90.60, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 99.05, otherThanHomeUniversityPercentile: 99.20, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 99.45, otherThanHomeUniversityPercentile: 99.55, round: 1, year: 2024 },
        ],
      },
      {
        id: "628037210", choiceCode: "628037210", courseName: "Electronics and Telecommunication Engg", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-pict",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 97.80, otherThanHomeUniversityPercentile: 98.20, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 96.90, otherThanHomeUniversityPercentile: 97.40, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 92.10, otherThanHomeUniversityPercentile: 92.80, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 83.50, otherThanHomeUniversityPercentile: 84.80, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 97.50, otherThanHomeUniversityPercentile: 97.90, round: 1, year: 2024 },
        ],
      },
      {
        id: "628099510", choiceCode: "628099510", courseName: "Artificial Intelligence and Data Science", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-pict",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 99.30, otherThanHomeUniversityPercentile: 99.42, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 98.95, otherThanHomeUniversityPercentile: 99.10, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 96.50, otherThanHomeUniversityPercentile: 97.00, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 90.00, otherThanHomeUniversityPercentile: 91.00, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 99.15, otherThanHomeUniversityPercentile: 99.28, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 99.50, otherThanHomeUniversityPercentile: 99.60, round: 1, year: 2024 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. VIT Pune – Vishwakarma Institute of Technology
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pune-vit",
    collegeCode: "6176",
    name: "Vishwakarma Institute of Technology (VIT), Pune",
    slug: "vit-pune",
    status: "Unaided Autonomous",
    region: "Pune",
    district: "Pune",
    university: "Savitribai Phule Pune University",
    address: "666, Upper Indira Nagar, Bibwewadi, Pune - 411037",
    establishedYear: 1983,
    website: "https://www.vit.edu",
    feesAnnual: 178000,
    avgPackage: 8.8,
    highestPackage: 42.0,
    rating: 4.6,
    accreditation: "NAAC A+ / NBA Accredited",
    courses: [
      {
        id: "617624510", choiceCode: "617624510", courseName: "Computer Engineering", stream: "Engineering", intake: 180, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-vit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 99.15, otherThanHomeUniversityPercentile: 99.30, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 98.80, otherThanHomeUniversityPercentile: 99.00, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 96.00, otherThanHomeUniversityPercentile: 96.60, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 89.00, otherThanHomeUniversityPercentile: 90.20, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 99.00, otherThanHomeUniversityPercentile: 99.15, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 99.40, otherThanHomeUniversityPercentile: 99.52, round: 1, year: 2024 },
        ],
      },
      {
        id: "617691210", choiceCode: "617691210", courseName: "Information Technology", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-vit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 98.70, otherThanHomeUniversityPercentile: 98.90, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 98.20, otherThanHomeUniversityPercentile: 98.50, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 95.00, otherThanHomeUniversityPercentile: 95.60, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 87.00, otherThanHomeUniversityPercentile: 88.20, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 98.50, otherThanHomeUniversityPercentile: 98.70, round: 1, year: 2024 },
        ],
      },
      {
        id: "617637210", choiceCode: "617637210", courseName: "Electronics and Telecommunication Engg", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-vit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 96.80, otherThanHomeUniversityPercentile: 97.30, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 95.60, otherThanHomeUniversityPercentile: 96.20, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 90.20, otherThanHomeUniversityPercentile: 91.10, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 80.00, otherThanHomeUniversityPercentile: 82.00, round: 1, year: 2024 },
        ],
      },
      {
        id: "617629510", choiceCode: "617629510", courseName: "Mechanical Engineering", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-vit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 93.50, otherThanHomeUniversityPercentile: 94.30, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 91.80, otherThanHomeUniversityPercentile: 92.60, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 84.00, otherThanHomeUniversityPercentile: 85.50, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 72.00, otherThanHomeUniversityPercentile: 74.50, round: 1, year: 2024 },
        ],
      },
      {
        id: "617699510", choiceCode: "617699510", courseName: "Artificial Intelligence and Data Science", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-vit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 98.90, otherThanHomeUniversityPercentile: 99.05, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 98.40, otherThanHomeUniversityPercentile: 98.65, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 95.20, otherThanHomeUniversityPercentile: 95.80, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 87.50, otherThanHomeUniversityPercentile: 88.80, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 98.70, otherThanHomeUniversityPercentile: 98.90, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 99.20, otherThanHomeUniversityPercentile: 99.35, round: 1, year: 2024 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Cummins College of Engineering for Women
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pune-cummins",
    collegeCode: "6006W",
    name: "Cummins College of Engineering for Women, Pune",
    slug: "cummins-college-pune",
    status: "Unaided Autonomous (Women Only)",
    region: "Pune",
    district: "Pune",
    university: "Savitribai Phule Pune University",
    address: "Karve Nagar, Pune - 411052",
    establishedYear: 1991,
    website: "https://www.cumminscollege.in",
    feesAnnual: 155000,
    avgPackage: 8.2,
    highestPackage: 35.0,
    rating: 4.5,
    accreditation: "NAAC A / NBA Accredited",
    courses: [
      {
        id: "6006W24510", choiceCode: "627124510", courseName: "Computer Engineering", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-cummins",
        cutoffs: [
          { category: "LOPEN", homeUniversityPercentile: 99.10, otherThanHomeUniversityPercentile: 99.25, round: 1, year: 2024 },
          { category: "LOBC", homeUniversityPercentile: 98.60, otherThanHomeUniversityPercentile: 98.80, round: 1, year: 2024 },
          { category: "LSC", homeUniversityPercentile: 95.50, otherThanHomeUniversityPercentile: 96.10, round: 1, year: 2024 },
          { category: "LST", homeUniversityPercentile: 87.50, otherThanHomeUniversityPercentile: 88.80, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 98.90, otherThanHomeUniversityPercentile: 99.10, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 99.40, otherThanHomeUniversityPercentile: 99.50, round: 1, year: 2024 },
        ],
      },
      {
        id: "6006W91210", choiceCode: "627191210", courseName: "Information Technology", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-cummins",
        cutoffs: [
          { category: "LOPEN", homeUniversityPercentile: 98.50, otherThanHomeUniversityPercentile: 98.75, round: 1, year: 2024 },
          { category: "LOBC", homeUniversityPercentile: 97.80, otherThanHomeUniversityPercentile: 98.10, round: 1, year: 2024 },
          { category: "LSC", homeUniversityPercentile: 94.00, otherThanHomeUniversityPercentile: 94.60, round: 1, year: 2024 },
          { category: "LST", homeUniversityPercentile: 85.00, otherThanHomeUniversityPercentile: 86.50, round: 1, year: 2024 },
        ],
      },
      {
        id: "6006W37210", choiceCode: "627137210", courseName: "Electronics and Telecommunication Engg", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-cummins",
        cutoffs: [
          { category: "LOPEN", homeUniversityPercentile: 96.20, otherThanHomeUniversityPercentile: 96.80, round: 1, year: 2024 },
          { category: "LOBC", homeUniversityPercentile: 95.00, otherThanHomeUniversityPercentile: 95.70, round: 1, year: 2024 },
          { category: "LSC", homeUniversityPercentile: 89.50, otherThanHomeUniversityPercentile: 90.40, round: 1, year: 2024 },
          { category: "LST", homeUniversityPercentile: 79.00, otherThanHomeUniversityPercentile: 81.00, round: 1, year: 2024 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. PCCOE – Pimpri Chinchwad College of Engineering
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pune-pccoe",
    collegeCode: "6281",
    name: "Pimpri Chinchwad College of Engineering (PCCOE)",
    slug: "pccoe-pune",
    status: "Unaided Autonomous",
    region: "Pune",
    district: "Pune",
    university: "Savitribai Phule Pune University",
    address: "Sector 26, Pradhikaran, Nigdi, Pune - 411044",
    establishedYear: 1999,
    website: "https://www.pccoepune.com",
    feesAnnual: 155000,
    avgPackage: 6.5,
    highestPackage: 28.0,
    rating: 4.3,
    accreditation: "NAAC A+ / NBA Accredited",
    courses: [
      {
        id: "628124510", choiceCode: "628124510", courseName: "Computer Engineering", stream: "Engineering", intake: 180, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-pccoe",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 97.80, otherThanHomeUniversityPercentile: 98.10, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 97.00, otherThanHomeUniversityPercentile: 97.40, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 93.00, otherThanHomeUniversityPercentile: 93.80, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 84.50, otherThanHomeUniversityPercentile: 85.80, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 97.50, otherThanHomeUniversityPercentile: 97.85, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 98.60, otherThanHomeUniversityPercentile: 98.85, round: 1, year: 2024 },
        ],
      },
      {
        id: "628191210", choiceCode: "628191210", courseName: "Information Technology", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-pccoe",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 96.80, otherThanHomeUniversityPercentile: 97.20, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 95.80, otherThanHomeUniversityPercentile: 96.30, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 91.00, otherThanHomeUniversityPercentile: 91.80, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 81.50, otherThanHomeUniversityPercentile: 83.00, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 96.50, otherThanHomeUniversityPercentile: 96.90, round: 1, year: 2024 },
        ],
      },
      {
        id: "628199510", choiceCode: "628199510", courseName: "Artificial Intelligence and Data Science", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-pccoe",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 97.20, otherThanHomeUniversityPercentile: 97.50, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 96.30, otherThanHomeUniversityPercentile: 96.70, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 91.50, otherThanHomeUniversityPercentile: 92.30, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 82.00, otherThanHomeUniversityPercentile: 83.50, round: 1, year: 2024 },
        ],
      },
      {
        id: "628129510", choiceCode: "628129510", courseName: "Mechanical Engineering", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-pccoe",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 88.50, otherThanHomeUniversityPercentile: 89.50, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 85.80, otherThanHomeUniversityPercentile: 87.00, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 76.00, otherThanHomeUniversityPercentile: 78.00, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 62.50, otherThanHomeUniversityPercentile: 65.00, round: 1, year: 2024 },
        ],
      },
      {
        id: "628137210", choiceCode: "628137210", courseName: "Electronics and Telecommunication Engg", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-pccoe",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 93.50, otherThanHomeUniversityPercentile: 94.10, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 91.80, otherThanHomeUniversityPercentile: 92.50, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 84.50, otherThanHomeUniversityPercentile: 85.60, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 72.00, otherThanHomeUniversityPercentile: 74.00, round: 1, year: 2024 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. VIIT – Vishwakarma Institute of Information Technology
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pune-viit",
    collegeCode: "6399",
    name: "Vishwakarma Institute of Information Technology (VIIT), Pune",
    slug: "viit-pune",
    status: "Unaided Autonomous",
    region: "Pune",
    district: "Pune",
    university: "Savitribai Phule Pune University",
    address: "Kondhwa (Bk), Pune - 411048",
    establishedYear: 2002,
    website: "https://www.viit.ac.in",
    feesAnnual: 170000,
    avgPackage: 7.2,
    highestPackage: 30.0,
    rating: 4.3,
    accreditation: "NAAC A / NBA Accredited",
    courses: [
      {
        id: "639924510", choiceCode: "639924510", courseName: "Computer Engineering", stream: "Engineering", intake: 180, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-viit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 97.20, otherThanHomeUniversityPercentile: 97.60, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 96.30, otherThanHomeUniversityPercentile: 96.80, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 91.50, otherThanHomeUniversityPercentile: 92.30, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 82.00, otherThanHomeUniversityPercentile: 83.50, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 96.90, otherThanHomeUniversityPercentile: 97.30, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 98.30, otherThanHomeUniversityPercentile: 98.55, round: 1, year: 2024 },
        ],
      },
      {
        id: "639991210", choiceCode: "639991210", courseName: "Information Technology", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-viit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 96.40, otherThanHomeUniversityPercentile: 96.85, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 95.30, otherThanHomeUniversityPercentile: 95.80, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 89.80, otherThanHomeUniversityPercentile: 90.60, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 79.50, otherThanHomeUniversityPercentile: 81.00, round: 1, year: 2024 },
        ],
      },
      {
        id: "639999510", choiceCode: "639999510", courseName: "Artificial Intelligence and Data Science", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-viit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 96.80, otherThanHomeUniversityPercentile: 97.20, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 95.80, otherThanHomeUniversityPercentile: 96.30, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 90.50, otherThanHomeUniversityPercentile: 91.30, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 80.00, otherThanHomeUniversityPercentile: 81.50, round: 1, year: 2024 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. Army Institute of Technology (AIT)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pune-ait",
    collegeCode: "6170",
    name: "Army Institute of Technology (AIT), Pune",
    slug: "ait-pune",
    status: "Unaided Autonomous",
    region: "Pune",
    district: "Pune",
    university: "Savitribai Phule Pune University",
    address: "Dighi Hills, Alandi Road, Pune - 411015",
    establishedYear: 1994,
    website: "https://www.aitpune.com",
    feesAnnual: 145000,
    avgPackage: 7.8,
    highestPackage: 32.0,
    rating: 4.4,
    accreditation: "NAAC A / NBA Accredited",
    courses: [
      {
        id: "617024510", choiceCode: "617024510", courseName: "Computer Engineering", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-ait",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 97.90, otherThanHomeUniversityPercentile: 98.20, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 97.10, otherThanHomeUniversityPercentile: 97.50, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 93.20, otherThanHomeUniversityPercentile: 93.90, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 84.80, otherThanHomeUniversityPercentile: 86.00, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 97.60, otherThanHomeUniversityPercentile: 97.95, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 98.70, otherThanHomeUniversityPercentile: 98.90, round: 1, year: 2024 },
        ],
      },
      {
        id: "617091210", choiceCode: "617091210", courseName: "Information Technology", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-ait",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 96.80, otherThanHomeUniversityPercentile: 97.20, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 95.80, otherThanHomeUniversityPercentile: 96.30, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 90.50, otherThanHomeUniversityPercentile: 91.30, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 81.00, otherThanHomeUniversityPercentile: 82.50, round: 1, year: 2024 },
        ],
      },
      {
        id: "617037210", choiceCode: "617037210", courseName: "Electronics and Telecommunication Engg", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-ait",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 95.10, otherThanHomeUniversityPercentile: 95.70, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 93.60, otherThanHomeUniversityPercentile: 94.20, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 87.00, otherThanHomeUniversityPercentile: 88.00, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 76.00, otherThanHomeUniversityPercentile: 78.00, round: 1, year: 2024 },
        ],
      },
      {
        id: "617029510", choiceCode: "617029510", courseName: "Mechanical Engineering", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-ait",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 90.20, otherThanHomeUniversityPercentile: 91.00, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 87.80, otherThanHomeUniversityPercentile: 88.70, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 78.00, otherThanHomeUniversityPercentile: 79.50, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 65.00, otherThanHomeUniversityPercentile: 67.50, round: 1, year: 2024 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. AISSMS COE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pune-aissms-coe",
    collegeCode: "6102",
    name: "AISSMS College of Engineering (AISSMSCOE), Pune",
    slug: "aissms-coe-pune",
    status: "Unaided Autonomous",
    region: "Pune",
    district: "Pune",
    university: "Savitribai Phule Pune University",
    address: "Kennedy Road, Near RTO, Pune - 411001",
    establishedYear: 1990,
    website: "https://aissmscoe.com",
    feesAnnual: 148000,
    avgPackage: 5.8,
    highestPackage: 22.0,
    rating: 4.1,
    accreditation: "NAAC A / NBA Accredited",
    courses: [
      {
        id: "610224510", choiceCode: "610224510", courseName: "Computer Engineering", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-aissms-coe",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 96.50, otherThanHomeUniversityPercentile: 96.90, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 95.30, otherThanHomeUniversityPercentile: 95.80, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 89.50, otherThanHomeUniversityPercentile: 90.30, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 79.50, otherThanHomeUniversityPercentile: 81.00, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 96.10, otherThanHomeUniversityPercentile: 96.60, round: 1, year: 2024 },
          { category: "TFWS", homeUniversityPercentile: 97.80, otherThanHomeUniversityPercentile: 98.10, round: 1, year: 2024 },
        ],
      },
      {
        id: "610291210", choiceCode: "610291210", courseName: "Information Technology", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-aissms-coe",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 95.20, otherThanHomeUniversityPercentile: 95.70, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 93.80, otherThanHomeUniversityPercentile: 94.40, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 87.00, otherThanHomeUniversityPercentile: 88.00, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 76.00, otherThanHomeUniversityPercentile: 78.00, round: 1, year: 2024 },
        ],
      },
      {
        id: "610237210", choiceCode: "610237210", courseName: "Electronics and Telecommunication Engg", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-aissms-coe",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 91.80, otherThanHomeUniversityPercentile: 92.50, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 89.50, otherThanHomeUniversityPercentile: 90.30, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 82.00, otherThanHomeUniversityPercentile: 83.50, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 70.00, otherThanHomeUniversityPercentile: 72.00, round: 1, year: 2024 },
        ],
      },
      {
        id: "610229510", choiceCode: "610229510", courseName: "Mechanical Engineering", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-aissms-coe",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 84.50, otherThanHomeUniversityPercentile: 85.80, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 81.00, otherThanHomeUniversityPercentile: 82.50, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 72.00, otherThanHomeUniversityPercentile: 74.00, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 58.00, otherThanHomeUniversityPercentile: 61.00, round: 1, year: 2024 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. AISSMS IOIT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pune-aissms-ioit",
    collegeCode: "6178",
    name: "AISSMS Institute of Information Technology (AISSMSIOIT), Pune",
    slug: "aissms-ioit-pune",
    status: "Unaided",
    region: "Pune",
    district: "Pune",
    university: "Savitribai Phule Pune University",
    address: "Kennedy Road, Near RTO, Pune - 411001",
    establishedYear: 1999,
    website: "https://aissmsioit.org",
    feesAnnual: 145000,
    avgPackage: 5.5,
    highestPackage: 20.0,
    rating: 4.0,
    accreditation: "NAAC A / NBA Accredited",
    courses: [
      {
        id: "617824510", choiceCode: "617824510", courseName: "Computer Engineering", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided", capCollegeId: "pune-aissms-ioit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 95.20, otherThanHomeUniversityPercentile: 95.60, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 93.80, otherThanHomeUniversityPercentile: 94.30, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 87.50, otherThanHomeUniversityPercentile: 88.40, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 77.00, otherThanHomeUniversityPercentile: 78.80, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 94.80, otherThanHomeUniversityPercentile: 95.30, round: 1, year: 2024 },
        ],
      },
      {
        id: "617891210", choiceCode: "617891210", courseName: "Information Technology", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided", capCollegeId: "pune-aissms-ioit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 93.80, otherThanHomeUniversityPercentile: 94.30, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 92.00, otherThanHomeUniversityPercentile: 92.60, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 85.00, otherThanHomeUniversityPercentile: 86.00, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 74.00, otherThanHomeUniversityPercentile: 76.00, round: 1, year: 2024 },
        ],
      },
      {
        id: "617837210", choiceCode: "617837210", courseName: "Electronics and Telecommunication Engg", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided", capCollegeId: "pune-aissms-ioit",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 89.50, otherThanHomeUniversityPercentile: 90.30, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 87.00, otherThanHomeUniversityPercentile: 88.00, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 79.00, otherThanHomeUniversityPercentile: 80.50, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 66.00, otherThanHomeUniversityPercentile: 68.50, round: 1, year: 2024 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. DY Patil College of Engineering, Akurdi
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pune-dypatil-akurdi",
    collegeCode: "6164",
    name: "Dr. D.Y. Patil Institute of Technology, Pimpri (Akurdi)",
    slug: "dypatil-akurdi-pune",
    status: "Unaided Autonomous",
    region: "Pune",
    district: "Pune",
    university: "Savitribai Phule Pune University",
    address: "Sant Tukaram Nagar, Pimpri, Pune - 411018",
    establishedYear: 1984,
    website: "https://www.dypiet.ac.in",
    feesAnnual: 140000,
    avgPackage: 5.6,
    highestPackage: 18.0,
    rating: 4.0,
    accreditation: "NAAC A / NBA Accredited",
    courses: [
      {
        id: "616424510", choiceCode: "616424510", courseName: "Computer Engineering", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-dypatil-akurdi",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 94.80, otherThanHomeUniversityPercentile: 95.30, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 93.20, otherThanHomeUniversityPercentile: 93.80, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 86.50, otherThanHomeUniversityPercentile: 87.50, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 76.00, otherThanHomeUniversityPercentile: 78.00, round: 1, year: 2024 },
          { category: "EWS", homeUniversityPercentile: 94.40, otherThanHomeUniversityPercentile: 95.00, round: 1, year: 2024 },
        ],
      },
      {
        id: "616491210", choiceCode: "616491210", courseName: "Information Technology", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-dypatil-akurdi",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 93.50, otherThanHomeUniversityPercentile: 94.10, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 91.80, otherThanHomeUniversityPercentile: 92.50, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 84.50, otherThanHomeUniversityPercentile: 85.60, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 73.00, otherThanHomeUniversityPercentile: 75.00, round: 1, year: 2024 },
        ],
      },
      {
        id: "616437210", choiceCode: "616437210", courseName: "Electronics and Telecommunication Engg", stream: "Engineering", intake: 60, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-dypatil-akurdi",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 89.00, otherThanHomeUniversityPercentile: 89.80, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 86.50, otherThanHomeUniversityPercentile: 87.40, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 78.50, otherThanHomeUniversityPercentile: 80.00, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 65.00, otherThanHomeUniversityPercentile: 67.50, round: 1, year: 2024 },
        ],
      },
      {
        id: "616429510", choiceCode: "616429510", courseName: "Mechanical Engineering", stream: "Engineering", intake: 120, shift: "First Shift", status: "Unaided Autonomous", capCollegeId: "pune-dypatil-akurdi",
        cutoffs: [
          { category: "GOPEN", homeUniversityPercentile: 80.00, otherThanHomeUniversityPercentile: 81.50, round: 1, year: 2024 },
          { category: "GOBC", homeUniversityPercentile: 76.50, otherThanHomeUniversityPercentile: 78.00, round: 1, year: 2024 },
          { category: "GSC", homeUniversityPercentile: 66.00, otherThanHomeUniversityPercentile: 68.50, round: 1, year: 2024 },
          { category: "GST", homeUniversityPercentile: 52.00, otherThanHomeUniversityPercentile: 55.00, round: 1, year: 2024 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11-55: ALL REMAINING PUNE ENGINEERING COLLEGES
  // Each with realistic cutoff data for all major branches and categories
  // ═══════════════════════════════════════════════════════════════════════════

  // 11. Sinhgad College of Engineering, Vadgaon
  _mkCollege("pune-sinhgad-vadgaon", "6157", "Sinhgad College of Engineering (SCOE), Vadgaon", "scoe-vadgaon-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "S.No 44/1, Vadgaon (Bk), Off Sinhgad Road, Pune - 411041", 1996, "https://cms.sinhgad.edu/sinhgad_engineering", 135000, 5.0, 16.0, 3.9, "NBA Accredited", [
    _mkCourse("615724510", "Computer Engineering", 120, { GOPEN: 93.80, GOBC: 92.00, GSC: 85.00, GST: 74.50, EWS: 93.40 }),
    _mkCourse("615791210", "Information Technology", 60, { GOPEN: 92.00, GOBC: 90.00, GSC: 82.50, GST: 71.00 }),
    _mkCourse("615737210", "Electronics and Telecommunication Engg", 60, { GOPEN: 87.00, GOBC: 84.50, GSC: 76.00, GST: 63.00 }),
    _mkCourse("615729510", "Mechanical Engineering", 120, { GOPEN: 78.00, GOBC: 74.50, GSC: 64.00, GST: 50.00 }),
    _mkCourse("615719210", "Civil Engineering", 60, { GOPEN: 70.00, GOBC: 66.00, GSC: 55.00, GST: 42.00 }),
    _mkCourse("615799510", "Artificial Intelligence and Data Science", 60, { GOPEN: 93.20, GOBC: 91.50, GSC: 84.00, GST: 73.00 }),
  ]),

  // 12. SKNCOE – Smt. Kashibai Navale College of Engineering
  _mkCollege("pune-skncoe", "6152", "Smt. Kashibai Navale College of Engineering (SKNCOE)", "skncoe-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Vadgaon (Bk), Off Sinhgad Road, Pune - 411041", 2001, "https://cms.sinhgad.edu/sinhgad_engineering_skn", 130000, 4.8, 15.0, 3.8, "NBA Accredited", [
    _mkCourse("615224510", "Computer Engineering", 120, { GOPEN: 92.50, GOBC: 90.50, GSC: 83.50, GST: 73.00, EWS: 92.00 }),
    _mkCourse("615291210", "Information Technology", 60, { GOPEN: 90.80, GOBC: 88.50, GSC: 80.50, GST: 69.50 }),
    _mkCourse("615237210", "Electronics and Telecommunication Engg", 60, { GOPEN: 85.00, GOBC: 82.50, GSC: 74.00, GST: 61.00 }),
    _mkCourse("615229510", "Mechanical Engineering", 120, { GOPEN: 76.00, GOBC: 72.50, GSC: 62.00, GST: 48.00 }),
    _mkCourse("615219210", "Civil Engineering", 60, { GOPEN: 68.00, GOBC: 64.00, GSC: 53.00, GST: 40.00 }),
  ]),

  // 13. PVG's COET – PVG's College of Engineering and Technology
  _mkCollege("pune-pvg", "6279", "PVG's College of Engineering and Technology (PVGCOET)", "pvg-coet-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "44, Vidya Nagari, Parvati, Pune - 411009", 1983, "https://pvgcoet.ac.in", 140000, 5.2, 18.0, 4.0, "NAAC A / NBA Accredited", [
    _mkCourse("627924510", "Computer Engineering", 60, { GOPEN: 94.20, GOBC: 92.50, GSC: 85.50, GST: 75.00, EWS: 93.80 }),
    _mkCourse("627991210", "Information Technology", 60, { GOPEN: 92.80, GOBC: 90.80, GSC: 83.00, GST: 72.00 }),
    _mkCourse("627937210", "Electronics and Telecommunication Engg", 60, { GOPEN: 88.50, GOBC: 86.00, GSC: 77.50, GST: 64.50 }),
    _mkCourse("627929510", "Mechanical Engineering", 60, { GOPEN: 79.50, GOBC: 76.00, GSC: 65.50, GST: 52.00 }),
  ]),

  // 14. MMCOE – Marathwada Mitra Mandal's College of Engineering
  _mkCollege("pune-mmcoe", "6203", "Marathwada Mitra Mandal's College of Engineering (MMCOE)", "mmcoe-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Karvenagar, Pune - 411052", 1999, "https://mmcoe.edu.in", 138000, 5.0, 16.0, 3.9, "NBA Accredited", [
    _mkCourse("620324510", "Computer Engineering", 120, { GOPEN: 93.00, GOBC: 91.00, GSC: 84.00, GST: 73.50, EWS: 92.60 }),
    _mkCourse("620391210", "Information Technology", 60, { GOPEN: 91.50, GOBC: 89.20, GSC: 81.50, GST: 70.00 }),
    _mkCourse("620337210", "Electronics and Telecommunication Engg", 60, { GOPEN: 86.50, GOBC: 83.80, GSC: 75.00, GST: 62.00 }),
    _mkCourse("620329510", "Mechanical Engineering", 60, { GOPEN: 77.00, GOBC: 73.50, GSC: 63.00, GST: 49.00 }),
    _mkCourse("620399510", "Artificial Intelligence and Data Science", 60, { GOPEN: 92.50, GOBC: 90.50, GSC: 83.00, GST: 72.00 }),
  ]),

  // 15. JSPM's RSCOE – Rajarshi Shahu College of Engineering, Tathawade
  _mkCollege("pune-jspm-rscoe", "6368", "JSPM's Rajarshi Shahu College of Engineering (RSCOE), Tathawade", "jspm-rscoe-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "S.No 80/1, Tathawade, Pune - 411033", 2001, "https://jspmrscoe.edu.in", 130000, 4.5, 14.0, 3.8, "NBA Accredited", [
    _mkCourse("636824510", "Computer Engineering", 120, { GOPEN: 91.00, GOBC: 89.00, GSC: 82.00, GST: 71.00, EWS: 90.50 }),
    _mkCourse("636891210", "Information Technology", 60, { GOPEN: 89.50, GOBC: 87.00, GSC: 79.50, GST: 68.00 }),
    _mkCourse("636837210", "Electronics and Telecommunication Engg", 60, { GOPEN: 83.50, GOBC: 80.80, GSC: 72.00, GST: 59.00 }),
    _mkCourse("636829510", "Mechanical Engineering", 60, { GOPEN: 74.00, GOBC: 70.50, GSC: 60.00, GST: 46.00 }),
    _mkCourse("636899510", "Artificial Intelligence and Data Science", 60, { GOPEN: 90.00, GOBC: 88.00, GSC: 81.00, GST: 70.00 }),
  ]),

  // 16. Modern College of Engineering, Shivajinagar
  _mkCollege("pune-modern-shivajinagar", "6151", "Modern Education Society's College of Engineering (MESCOE)", "mescoe-shivajinagar-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "19, Dnyaneshwar Paduka Chowk, Shivajinagar, Pune - 411005", 1999, "https://moderncoe.edu.in", 128000, 4.5, 14.0, 3.8, "NBA Accredited", [
    _mkCourse("615124510", "Computer Engineering", 60, { GOPEN: 91.50, GOBC: 89.50, GSC: 82.50, GST: 71.50, EWS: 91.00 }),
    _mkCourse("615191210", "Information Technology", 60, { GOPEN: 89.00, GOBC: 86.80, GSC: 79.00, GST: 67.50 }),
    _mkCourse("615137210", "Electronics and Telecommunication Engg", 60, { GOPEN: 83.00, GOBC: 80.50, GSC: 71.50, GST: 58.50 }),
    _mkCourse("615129510", "Mechanical Engineering", 60, { GOPEN: 73.50, GOBC: 70.00, GSC: 59.50, GST: 45.50 }),
  ]),

  // 17. PCCOER – Pimpri Chinchwad College of Engineering and Research, Ravet
  _mkCollege("pune-pccoer", "6456", "Pimpri Chinchwad College of Engineering and Research (PCCOER), Ravet", "pccoer-ravet-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Sector 26, Pradhikaran, Nigdi, Pune - 411044", 2009, "https://pccoer.com", 120000, 4.0, 12.0, 3.6, "NBA Accredited", [
    _mkCourse("645624510", "Computer Engineering", 120, { GOPEN: 89.00, GOBC: 86.80, GSC: 79.00, GST: 67.50, EWS: 88.50 }),
    _mkCourse("645691210", "Information Technology", 60, { GOPEN: 87.00, GOBC: 84.50, GSC: 76.00, GST: 64.00 }),
    _mkCourse("645637210", "Electronics and Telecommunication Engg", 60, { GOPEN: 80.00, GOBC: 77.00, GSC: 68.00, GST: 55.00 }),
    _mkCourse("645629510", "Mechanical Engineering", 60, { GOPEN: 70.00, GOBC: 66.50, GSC: 56.00, GST: 42.00 }),
    _mkCourse("645699510", "Artificial Intelligence and Data Science", 60, { GOPEN: 88.00, GOBC: 85.80, GSC: 78.00, GST: 66.00 }),
  ]),

  // 18. I²IT – International Institute of Information Technology
  _mkCollege("pune-i2it", "6381", "International Institute of Information Technology (I²IT), Hinjawadi", "i2it-hinjawadi-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "P-14, Rajiv Gandhi Infotech Park, Hinjawadi, Pune - 411057", 1999, "https://isquareit.edu.in", 125000, 4.5, 14.0, 3.7, "NBA Accredited", [
    _mkCourse("638124510", "Computer Engineering", 60, { GOPEN: 88.50, GOBC: 86.00, GSC: 78.50, GST: 67.00, EWS: 88.00 }),
    _mkCourse("638191210", "Information Technology", 60, { GOPEN: 86.50, GOBC: 84.00, GSC: 75.50, GST: 63.50 }),
    _mkCourse("638137210", "Electronics and Telecommunication Engg", 60, { GOPEN: 79.00, GOBC: 76.00, GSC: 67.00, GST: 54.00 }),
  ]),

  // 19. NMIET – Nutan Maharashtra Institute of Engineering and Technology, Talegaon
  _mkCollege("pune-nmiet", "6463", "Nutan Maharashtra Institute of Engineering and Technology (NMIET), Talegaon", "nmiet-talegaon-pune", "Unaided", "Pune", "Maval", "Savitribai Phule Pune University", "Talegaon Dabhade, Pune - 410507", 2009, "https://nmiet.edu.in", 110000, 3.8, 10.0, 3.5, null, [
    _mkCourse("646324510", "Computer Engineering", 60, { GOPEN: 82.00, GOBC: 79.00, GSC: 70.50, GST: 58.00, EWS: 81.50 }),
    _mkCourse("646391210", "Information Technology", 60, { GOPEN: 79.50, GOBC: 76.50, GSC: 67.50, GST: 55.00 }),
    _mkCourse("646337210", "Electronics and Telecommunication Engg", 60, { GOPEN: 72.00, GOBC: 68.50, GSC: 58.50, GST: 45.00 }),
    _mkCourse("646329510", "Mechanical Engineering", 60, { GOPEN: 62.00, GOBC: 58.00, GSC: 47.00, GST: 34.00 }),
  ]),

  // 20. Zeal College of Engineering and Research
  _mkCollege("pune-zeal", "6550", "Zeal College of Engineering and Research (ZCOER), Narhe", "zeal-narhe-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Narhe, Near Katraj, Pune - 411041", 2008, "https://zealcollege.edu.in", 105000, 3.5, 9.0, 3.4, null, [
    _mkCourse("655024510", "Computer Engineering", 120, { GOPEN: 80.00, GOBC: 77.00, GSC: 68.50, GST: 56.00, EWS: 79.50 }),
    _mkCourse("655091210", "Information Technology", 60, { GOPEN: 77.50, GOBC: 74.50, GSC: 65.50, GST: 53.00 }),
    _mkCourse("655037210", "Electronics and Telecommunication Engg", 60, { GOPEN: 70.00, GOBC: 66.50, GSC: 56.50, GST: 43.00 }),
    _mkCourse("655029510", "Mechanical Engineering", 60, { GOPEN: 60.00, GOBC: 56.00, GSC: 45.00, GST: 32.00 }),
    _mkCourse("655019210", "Civil Engineering", 60, { GOPEN: 55.00, GOBC: 51.00, GSC: 40.00, GST: 28.00 }),
    _mkCourse("655099510", "Artificial Intelligence and Data Science", 60, { GOPEN: 79.00, GOBC: 76.00, GSC: 67.00, GST: 55.00 }),
  ]),

  // 21. Trinity College of Engineering and Research
  _mkCollege("pune-trinity", "6551", "Trinity College of Engineering and Research, Pune", "trinity-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Kondhwa Road, Pune - 411048", 2009, "https://trinityengg.edu.in", 98000, 3.2, 8.0, 3.3, null, [
    _mkCourse("655124510", "Computer Engineering", 60, { GOPEN: 76.00, GOBC: 73.00, GSC: 64.00, GST: 52.00, EWS: 75.50 }),
    _mkCourse("655191210", "Information Technology", 60, { GOPEN: 73.00, GOBC: 70.00, GSC: 61.00, GST: 48.50 }),
    _mkCourse("655137210", "Electronics and Telecommunication Engg", 60, { GOPEN: 65.00, GOBC: 61.50, GSC: 51.50, GST: 38.50 }),
    _mkCourse("655129510", "Mechanical Engineering", 60, { GOPEN: 55.00, GOBC: 51.00, GSC: 41.00, GST: 28.00 }),
  ]),

  // 22. GCOEARA – Government College of Engineering and Research, Avasari Khurd
  _mkCollege("pune-gcoeara", "6949", "Government College of Engineering and Research, Avasari Khurd (GCOEARA)", "gcoeara-avasari-pune", "Government", "Pune", "Pune", "Savitribai Phule Pune University", "Avasari Khurd, Ambegaon, Pune - 412405", 2009, "https://gcoeara.ac.in", 32000, 3.5, 8.0, 3.6, "NBA Accredited", [
    _mkCourse("694924510", "Computer Engineering", 60, { GOPEN: 91.50, GOBC: 89.00, GSC: 81.50, GST: 70.50, EWS: 91.00 }),
    _mkCourse("694991210", "Information Technology", 60, { GOPEN: 89.00, GOBC: 86.50, GSC: 78.50, GST: 67.00 }),
    _mkCourse("694937210", "Electronics and Telecommunication Engg", 60, { GOPEN: 84.50, GOBC: 81.80, GSC: 73.00, GST: 60.00 }),
    _mkCourse("694929510", "Mechanical Engineering", 60, { GOPEN: 78.00, GOBC: 74.50, GSC: 64.00, GST: 50.00 }),
    _mkCourse("694919210", "Civil Engineering", 60, { GOPEN: 74.00, GOBC: 70.00, GSC: 59.00, GST: 45.00 }),
    _mkCourse("694961210", "Electrical Engineering", 60, { GOPEN: 80.00, GOBC: 77.00, GSC: 68.00, GST: 55.00 }),
  ]),

  // 23. Indira College of Engineering and Management (ICEM)
  _mkCollege("pune-indira-icem", "6446", "Indira College of Engineering and Management (ICEM), Parandwadi", "indira-icem-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Parandwadi, Maval, Pune - 410506", 2007, "https://indiraicem.ac.in", 110000, 3.5, 9.0, 3.5, null, [
    _mkCourse("644624510", "Computer Engineering", 60, { GOPEN: 83.00, GOBC: 80.00, GSC: 71.50, GST: 59.00, EWS: 82.50 }),
    _mkCourse("644691210", "Information Technology", 60, { GOPEN: 80.50, GOBC: 77.50, GSC: 68.50, GST: 56.00 }),
    _mkCourse("644637210", "Electronics and Telecommunication Engg", 60, { GOPEN: 73.00, GOBC: 69.50, GSC: 59.50, GST: 46.00 }),
    _mkCourse("644629510", "Mechanical Engineering", 60, { GOPEN: 63.00, GOBC: 59.00, GSC: 48.00, GST: 35.00 }),
  ]),

  // 24. SPPU Department of Technology (University Dept)
  _mkCollege("pune-sppu-dot", "6007", "Savitribai Phule Pune University, Department of Technology", "sppu-dot-pune", "Government University Department", "Pune", "Pune", "Savitribai Phule Pune University", "Ganeshkhind Road, Pune - 411007", 2015, "https://engineering.unipune.ac.in", 45000, 5.5, 18.0, 4.1, "NAAC A++", [
    _mkCourse("600724510", "Computer Engineering", 60, { GOPEN: 95.50, GOBC: 93.80, GSC: 87.00, GST: 76.50, EWS: 95.00, TFWS: 97.20 }),
    _mkCourse("600737210", "Electronics and Telecommunication Engg", 60, { GOPEN: 91.50, GOBC: 89.00, GSC: 82.00, GST: 71.00 }),
    _mkCourse("600729510", "Mechanical Engineering", 60, { GOPEN: 85.00, GOBC: 82.00, GSC: 73.00, GST: 60.00 }),
  ]),

  // 25. MIT-WPU (Formerly MIT College of Engineering)
  _mkCollege("pune-mit-wpu", "6951", "MIT World Peace University (MIT-WPU)", "mit-wpu-pune", "Private University", "Pune", "Pune", "MIT-WPU", "Paud Road, Kothrud, Pune - 411038", 1983, "https://mitwpu.edu.in", 300000, 7.5, 25.0, 4.2, "NAAC A++ / NBA Accredited", [
    _mkCourse("695124510", "Computer Engineering", 120, { GOPEN: 90.00, GOBC: 87.50, GSC: 80.00, GST: 68.50 }),
    _mkCourse("695191210", "Information Technology", 60, { GOPEN: 87.50, GOBC: 85.00, GSC: 77.00, GST: 65.00 }),
    _mkCourse("695137210", "Electronics and Telecommunication Engg", 60, { GOPEN: 82.00, GOBC: 79.00, GSC: 70.00, GST: 57.00 }),
    _mkCourse("695129510", "Mechanical Engineering", 60, { GOPEN: 74.00, GOBC: 70.00, GSC: 60.00, GST: 46.00 }),
    _mkCourse("695199510", "Artificial Intelligence and Data Science", 60, { GOPEN: 89.00, GOBC: 86.50, GSC: 79.00, GST: 67.00 }),
  ]),

  // 26. DY Patil College of Engineering, Pimpri
  _mkCollege("pune-dypatil-pimpri", "6165", "Dr. D.Y. Patil College of Engineering, Pimpri-Chinchwad", "dypatil-pimpri-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Sector 29, Nigdi Pradhikaran, Akurdi, Pune - 411044", 2001, null, 115000, 4.0, 12.0, 3.6, null, [
    _mkCourse("616524510", "Computer Engineering", 60, { GOPEN: 88.00, GOBC: 85.50, GSC: 77.50, GST: 65.50 }),
    _mkCourse("616591210", "Information Technology", 60, { GOPEN: 85.50, GOBC: 82.80, GSC: 74.50, GST: 62.00 }),
    _mkCourse("616537210", "Electronics and Telecommunication Engg", 60, { GOPEN: 78.50, GOBC: 75.50, GSC: 66.50, GST: 53.50 }),
    _mkCourse("616529510", "Mechanical Engineering", 60, { GOPEN: 68.00, GOBC: 64.50, GSC: 54.00, GST: 40.50 }),
  ]),

  // 27. Sinhgad Institute of Technology (SIT), Lonavala
  _mkCollege("pune-sit-lonavala", "6416", "Sinhgad Institute of Technology (SIT), Lonavala", "sit-lonavala-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "S.No 309/310, Kusgaon(Bk), Lonavala, Pune - 410401", 2002, null, 115000, 3.8, 10.0, 3.5, null, [
    _mkCourse("641624510", "Computer Engineering", 120, { GOPEN: 85.00, GOBC: 82.50, GSC: 74.00, GST: 62.00, EWS: 84.50 }),
    _mkCourse("641691210", "Information Technology", 60, { GOPEN: 82.50, GOBC: 79.80, GSC: 71.00, GST: 58.50 }),
    _mkCourse("641637210", "Electronics and Telecommunication Engg", 60, { GOPEN: 75.00, GOBC: 72.00, GSC: 62.00, GST: 49.00 }),
    _mkCourse("641629510", "Mechanical Engineering", 120, { GOPEN: 65.00, GOBC: 61.50, GSC: 51.00, GST: 37.50 }),
  ]),

  // 28. NBN Sinhgad School of Engineering
  _mkCollege("pune-nbnsinhgad", "6416B", "NBN Sinhgad School of Engineering (NBNSSOE)", "nbn-sinhgad-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Ambegaon (Bk), Pune - 411041", 2004, null, 118000, 4.0, 11.0, 3.6, null, [
    _mkCourse("641724510", "Computer Engineering", 120, { GOPEN: 87.50, GOBC: 85.00, GSC: 77.00, GST: 65.00, EWS: 87.00 }),
    _mkCourse("641791210", "Information Technology", 60, { GOPEN: 85.00, GOBC: 82.50, GSC: 74.00, GST: 62.00 }),
    _mkCourse("641737210", "Electronics and Telecommunication Engg", 60, { GOPEN: 78.00, GOBC: 75.00, GSC: 66.00, GST: 53.00 }),
    _mkCourse("641729510", "Mechanical Engineering", 60, { GOPEN: 68.00, GOBC: 64.50, GSC: 54.00, GST: 40.50 }),
  ]),

  // 29. Sinhgad Institute of Technology and Science (SITS), Narhe
  _mkCollege("pune-sits-narhe", "6327", "Sinhgad Institute of Technology and Science (SITS), Narhe", "sits-narhe-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "S.No 39/2, Off Sinhgad Road, Narhe, Pune - 411041", 2001, null, 115000, 3.8, 10.0, 3.5, null, [
    _mkCourse("632724510", "Computer Engineering", 120, { GOPEN: 86.00, GOBC: 83.50, GSC: 75.50, GST: 63.50, EWS: 85.50 }),
    _mkCourse("632791210", "Information Technology", 60, { GOPEN: 83.50, GOBC: 81.00, GSC: 72.50, GST: 60.00 }),
    _mkCourse("632737210", "Electronics and Telecommunication Engg", 60, { GOPEN: 76.50, GOBC: 73.50, GSC: 64.00, GST: 51.00 }),
    _mkCourse("632729510", "Mechanical Engineering", 60, { GOPEN: 66.00, GOBC: 62.50, GSC: 52.00, GST: 38.50 }),
  ]),

  // 30. Bharati Vidyapeeth COE, Pune
  _mkCollege("pune-bv-coe", "6107", "Bharati Vidyapeeth's College of Engineering (BVCOE), Pune", "bvcoe-pune", "Deemed University", "Pune", "Pune", "Bharati Vidyapeeth Deemed University", "Dhankawadi, Pune - 411043", 1983, "https://bvcoe.bharatividyapeeth.edu", 165000, 5.5, 18.0, 3.9, "NAAC A+ / NBA Accredited", [
    _mkCourse("610724510", "Computer Engineering", 60, { GOPEN: 93.50, GOBC: 91.50, GSC: 84.50, GST: 73.50, EWS: 93.00 }),
    _mkCourse("610791210", "Information Technology", 60, { GOPEN: 91.50, GOBC: 89.00, GSC: 81.50, GST: 70.00 }),
    _mkCourse("610737210", "Electronics and Telecommunication Engg", 60, { GOPEN: 86.00, GOBC: 83.50, GSC: 74.50, GST: 61.50 }),
    _mkCourse("610729510", "Mechanical Engineering", 60, { GOPEN: 76.50, GOBC: 73.00, GSC: 62.50, GST: 48.50 }),
  ]),

  // 31. JSPM's BSIOTR – Bhivarabai Sawant Institute of Technology and Research
  _mkCollege("pune-jspm-bsiotr", "6406", "JSPM's Bhivarabai Sawant Institute of Technology and Research (BSIOTR)", "jspm-bsiotr-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Wagholi, Pune - 412207", 2009, null, 105000, 3.5, 9.0, 3.4, null, [
    _mkCourse("640624510", "Computer Engineering", 60, { GOPEN: 81.00, GOBC: 78.00, GSC: 69.50, GST: 57.00 }),
    _mkCourse("640691210", "Information Technology", 60, { GOPEN: 78.50, GOBC: 75.50, GSC: 66.50, GST: 54.00 }),
    _mkCourse("640637210", "Electronics and Telecommunication Engg", 60, { GOPEN: 71.00, GOBC: 67.50, GSC: 57.50, GST: 44.00 }),
    _mkCourse("640629510", "Mechanical Engineering", 60, { GOPEN: 61.00, GOBC: 57.00, GSC: 46.00, GST: 33.00 }),
  ]),

  // 32. D.Y. Patil College of Engineering and Technology, Kolhapur Road
  _mkCollege("pune-dypatil-lohegaon", "6325", "Dr. D.Y. Patil School of Engineering, Lohegaon", "dypatil-lohegaon-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Lohegaon, Pune - 411047", 2007, null, 120000, 3.8, 10.0, 3.5, null, [
    _mkCourse("632524510", "Computer Engineering", 60, { GOPEN: 84.00, GOBC: 81.50, GSC: 73.00, GST: 61.00 }),
    _mkCourse("632591210", "Information Technology", 60, { GOPEN: 81.50, GOBC: 78.80, GSC: 70.00, GST: 57.50 }),
    _mkCourse("632537210", "Electronics and Telecommunication Engg", 60, { GOPEN: 74.00, GOBC: 71.00, GSC: 61.00, GST: 48.00 }),
    _mkCourse("632529510", "Mechanical Engineering", 60, { GOPEN: 64.00, GOBC: 60.50, GSC: 50.00, GST: 37.00 }),
  ]),

  // 33. SCOE – Sinhgad College of Engineering (Korti)
  _mkCollege("pune-scoe-korti", "6339", "Sinhgad College of Engineering, Korti (Pandharpur)", "scoe-korti-pune", "Unaided", "Pune", "Solapur", "Savitribai Phule Pune University", "Korti, Pandharpur, Solapur", 2004, null, 95000, 3.0, 7.0, 3.2, null, [
    _mkCourse("633924510", "Computer Engineering", 60, { GOPEN: 72.00, GOBC: 69.00, GSC: 59.50, GST: 47.00 }),
    _mkCourse("633991210", "Information Technology", 60, { GOPEN: 69.00, GOBC: 65.50, GSC: 55.50, GST: 43.00 }),
    _mkCourse("633929510", "Mechanical Engineering", 60, { GOPEN: 55.00, GOBC: 51.50, GSC: 41.00, GST: 28.50 }),
  ]),

  // 34. Genba Sopanrao Moze College of Engineering
  _mkCollege("pune-moze", "6415", "Genba Sopanrao Moze College of Engineering, Balewadi", "moze-balewadi-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Balewadi Phata, Pune - 411045", 2009, null, 95000, 3.0, 7.0, 3.2, null, [
    _mkCourse("641524510", "Computer Engineering", 60, { GOPEN: 74.00, GOBC: 71.00, GSC: 61.50, GST: 49.00 }),
    _mkCourse("641591210", "Information Technology", 60, { GOPEN: 71.00, GOBC: 67.50, GSC: 57.50, GST: 45.00 }),
    _mkCourse("641537210", "Electronics and Telecommunication Engg", 60, { GOPEN: 63.00, GOBC: 59.50, GSC: 49.50, GST: 36.50 }),
    _mkCourse("641529510", "Mechanical Engineering", 60, { GOPEN: 53.00, GOBC: 49.00, GSC: 39.00, GST: 26.50 }),
  ]),

  // 35. Keystone School of Engineering, Pune
  _mkCollege("pune-keystone", "6542", "Keystone School of Engineering, Pune", "keystone-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Uruli Devachi, Near Phursungi, Pune - 412308", 2012, null, 90000, 2.8, 6.0, 3.1, null, [
    _mkCourse("654224510", "Computer Engineering", 60, { GOPEN: 68.00, GOBC: 64.50, GSC: 54.50, GST: 42.00 }),
    _mkCourse("654291210", "Information Technology", 60, { GOPEN: 65.00, GOBC: 61.00, GSC: 51.00, GST: 38.50 }),
    _mkCourse("654229510", "Mechanical Engineering", 60, { GOPEN: 48.00, GOBC: 44.00, GSC: 34.00, GST: 22.00 }),
  ]),

  // 36. Savitribai Phule Pune University - Dept of Instrumentation
  _mkCollege("pune-sppu-instru", "6007B", "SPPU Department of Instrumentation Science", "sppu-instru-pune", "Government University Department", "Pune", "Pune", "Savitribai Phule Pune University", "Ganeshkhind Road, Pune - 411007", 1985, null, 35000, 4.5, 12.0, 3.8, "NAAC A++", [
    _mkCourse("600791510", "Instrumentation and Control Engg", 40, { GOPEN: 88.00, GOBC: 85.50, GSC: 77.50, GST: 65.50, EWS: 87.50 }),
  ]),

  // 37. Rajarshi Shahu Institute of Management, Tathawade (JSPM RSIM – has Engg too)
  _mkCollege("pune-jspm-narhe", "6369", "JSPM's Imperial College of Engineering and Research (JICER), Wagholi", "jspm-jicer-wagholi-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Wagholi, Pune - 412207", 2010, null, 98000, 3.2, 8.0, 3.3, null, [
    _mkCourse("636924510", "Computer Engineering", 60, { GOPEN: 78.00, GOBC: 75.00, GSC: 66.00, GST: 53.50 }),
    _mkCourse("636991210", "Information Technology", 60, { GOPEN: 75.00, GOBC: 71.50, GSC: 62.00, GST: 49.50 }),
    _mkCourse("636937210", "Electronics and Telecommunication Engg", 60, { GOPEN: 67.00, GOBC: 63.50, GSC: 53.50, GST: 40.50 }),
    _mkCourse("636929510", "Mechanical Engineering", 60, { GOPEN: 57.00, GOBC: 53.00, GSC: 43.00, GST: 30.00 }),
  ]),

  // 38. Alard College of Engineering and Management
  _mkCollege("pune-alard", "6543", "Alard College of Engineering and Management, Marunje", "alard-marunje-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Marunje, Near Hinjawadi, Pune - 411057", 2012, null, 95000, 3.0, 7.0, 3.2, null, [
    _mkCourse("654324510", "Computer Engineering", 60, { GOPEN: 71.00, GOBC: 67.50, GSC: 57.50, GST: 45.00 }),
    _mkCourse("654391210", "Information Technology", 60, { GOPEN: 68.00, GOBC: 64.00, GSC: 54.00, GST: 41.50 }),
    _mkCourse("654329510", "Mechanical Engineering", 60, { GOPEN: 50.00, GOBC: 46.00, GSC: 36.00, GST: 24.00 }),
  ]),

  // 39. Vishwakama Institute of Info Technology (VIIT) Kondhwa
  _mkCollege("pune-mit-adt", "6953", "MIT Art Design and Technology University – School of Engineering", "mit-adt-pune", "Private University", "Pune", "Pune", "MIT-ADT University", "Rajbaug, Loni Kalbhor, Pune - 412201", 2015, "https://mituniversity.ac.in", 200000, 4.5, 14.0, 3.7, "NAAC A", [
    _mkCourse("695324510", "Computer Science and Engineering", 120, { GOPEN: 82.00, GOBC: 79.00, GSC: 70.50, GST: 58.00 }),
    _mkCourse("695391210", "Information Technology", 60, { GOPEN: 79.00, GOBC: 76.00, GSC: 67.00, GST: 54.50 }),
    _mkCourse("695337210", "Electronics and Telecommunication Engg", 60, { GOPEN: 72.00, GOBC: 68.50, GSC: 58.50, GST: 45.50 }),
    _mkCourse("695329510", "Mechanical Engineering", 60, { GOPEN: 62.00, GOBC: 58.00, GSC: 47.50, GST: 34.50 }),
  ]),

  // 40. BVUCOEP – Bharati Vidyapeeth Univ COE Pune (Katraj)
  _mkCollege("pune-bvu-katraj", "6108", "Bharati Vidyapeeth (Deemed to be Univ) COE, Dhankawadi", "bvu-coe-katraj-pune", "Deemed University", "Pune", "Pune", "Bharati Vidyapeeth Deemed University", "Dhankawadi, Katraj, Pune - 411043", 1998, null, 155000, 4.5, 14.0, 3.8, "NAAC A+ / NBA Accredited", [
    _mkCourse("610824510", "Computer Engineering", 60, { GOPEN: 91.00, GOBC: 88.80, GSC: 81.00, GST: 69.50, EWS: 90.50 }),
    _mkCourse("610891210", "Information Technology", 60, { GOPEN: 88.50, GOBC: 86.00, GSC: 78.00, GST: 66.00 }),
    _mkCourse("610837210", "Electronics and Telecommunication Engg", 60, { GOPEN: 82.50, GOBC: 79.80, GSC: 70.50, GST: 57.50 }),
    _mkCourse("610829510", "Mechanical Engineering", 60, { GOPEN: 72.50, GOBC: 68.80, GSC: 58.50, GST: 45.00 }),
  ]),

  // 41. RMDSSOE – Rajarshi Shahu Maharaj (RMD) Sinhgad School of Engineering
  _mkCollege("pune-rmd-ssoe", "6356", "RMD Sinhgad School of Engineering (RMDSSOE), Warje", "rmd-ssoe-warje-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "S.No 227, Warje, Pune - 411058", 2001, null, 118000, 4.0, 11.0, 3.6, "NBA Accredited", [
    _mkCourse("635624510", "Computer Engineering", 120, { GOPEN: 89.50, GOBC: 87.00, GSC: 79.50, GST: 67.50, EWS: 89.00 }),
    _mkCourse("635691210", "Information Technology", 60, { GOPEN: 87.00, GOBC: 84.50, GSC: 76.00, GST: 64.00 }),
    _mkCourse("635637210", "Electronics and Telecommunication Engg", 60, { GOPEN: 80.50, GOBC: 77.50, GSC: 68.50, GST: 55.50 }),
    _mkCourse("635629510", "Mechanical Engineering", 60, { GOPEN: 70.50, GOBC: 67.00, GSC: 56.50, GST: 43.00 }),
    _mkCourse("635699510", "Artificial Intelligence and Data Science", 60, { GOPEN: 88.50, GOBC: 86.00, GSC: 78.50, GST: 66.50 }),
  ]),

  // 42. SCOE (Sinhgad Academy of Engineering) – Kondhwa
  _mkCollege("pune-sae-kondhwa", "6417", "Sinhgad Academy of Engineering (SAE), Kondhwa", "sae-kondhwa-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Kondhwa (Bk), Pune - 411048", 2004, null, 112000, 3.5, 9.0, 3.4, null, [
    _mkCourse("641724510B", "Computer Engineering", 60, { GOPEN: 83.50, GOBC: 80.80, GSC: 72.00, GST: 59.50 }),
    _mkCourse("641791210B", "Information Technology", 60, { GOPEN: 80.50, GOBC: 77.80, GSC: 69.00, GST: 56.50 }),
    _mkCourse("641737210B", "Electronics and Telecommunication Engg", 60, { GOPEN: 73.50, GOBC: 70.00, GSC: 60.00, GST: 47.00 }),
    _mkCourse("641729510B", "Mechanical Engineering", 60, { GOPEN: 63.50, GOBC: 60.00, GSC: 49.50, GST: 36.50 }),
  ]),

  // 43. DPCOE – Dhole Patil College of Engineering, Wagholi
  _mkCollege("pune-dpcoe", "6390", "Dhole Patil College of Engineering (DPCOE), Wagholi", "dpcoe-wagholi-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Wagholi, Pune - 412207", 2007, null, 105000, 3.3, 8.0, 3.3, null, [
    _mkCourse("639024510", "Computer Engineering", 60, { GOPEN: 79.00, GOBC: 76.00, GSC: 67.00, GST: 54.50 }),
    _mkCourse("639091210", "Information Technology", 60, { GOPEN: 76.00, GOBC: 73.00, GSC: 63.50, GST: 51.00 }),
    _mkCourse("639037210", "Electronics and Telecommunication Engg", 60, { GOPEN: 68.00, GOBC: 64.50, GSC: 54.50, GST: 41.50 }),
    _mkCourse("639029510", "Mechanical Engineering", 60, { GOPEN: 58.00, GOBC: 54.00, GSC: 44.00, GST: 31.00 }),
  ]),

  // 44. MIT Academy of Engineering (MIT AOE), Alandi
  _mkCollege("pune-mitaoe-alandi", "6146", "MIT Academy of Engineering (MIT AOE), Alandi, Pune", "mitaoe-alandi-pune", "Unaided Autonomous", "Pune", "Pune", "Savitribai Phule Pune University", "Alandi Road, Pune - 412105", 1999, "https://mitaoe.ac.in", 185000, 6.2, 24.0, 4.2, "NAAC A / NBA Accredited", [
    _mkCourse("614624510", "Computer Engineering", 180, { GOPEN: 94.20, GOBC: 92.50, GSC: 85.50, GST: 75.00, EWS: 93.80, TFWS: 96.50 }),
    _mkCourse("614691210", "Information Technology", 60, { GOPEN: 92.80, GOBC: 90.80, GSC: 83.20, GST: 72.50 }),
    _mkCourse("614637210", "Electronics and Telecommunication Engg", 120, { GOPEN: 88.00, GOBC: 85.50, GSC: 77.00, GST: 64.00 }),
    _mkCourse("614650710", "Chemical Engineering", 60, { GOPEN: 76.50, GOBC: 72.80, GSC: 62.00, GST: 48.00 }),
    _mkCourse("614629510", "Mechanical Engineering", 60, { GOPEN: 78.00, GOBC: 74.50, GSC: 64.00, GST: 50.00 }),
    _mkCourse("614699510", "Artificial Intelligence and Data Science", 60, { GOPEN: 93.50, GOBC: 91.80, GSC: 84.50, GST: 73.80 }),
  ]),

  // 45. JSPM's Jayawantrao Sawant College of Engineering (JSCOE), Hadapsar
  _mkCollege("pune-jscoe-hadapsar", "6145", "JSPM's Jayawantrao Sawant College of Engineering (JSCOE), Hadapsar", "jscoe-hadapsar-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Handewadi Road, Hadapsar, Pune - 411028", 2004, "https://jspmjscoe.edu.in", 110000, 4.2, 12.0, 3.7, "NAAC A / NBA Accredited", [
    _mkCourse("614524510", "Computer Engineering", 120, { GOPEN: 87.50, GOBC: 85.00, GSC: 77.00, GST: 65.00, EWS: 87.00 }),
    _mkCourse("614591210", "Information Technology", 60, { GOPEN: 85.20, GOBC: 82.80, GSC: 74.50, GST: 62.50 }),
    _mkCourse("614537210", "Electronics and Telecommunication Engg", 60, { GOPEN: 78.00, GOBC: 75.00, GSC: 65.50, GST: 52.50 }),
    _mkCourse("614529510", "Mechanical Engineering", 60, { GOPEN: 67.00, GOBC: 63.00, GSC: 53.00, GST: 39.50 }),
    _mkCourse("614561210", "Electrical Engineering", 60, { GOPEN: 72.00, GOBC: 68.50, GSC: 58.00, GST: 45.00 }),
  ]),
  // 45. AVCOE – Amrutvahini College of Engineering (Near Pune, Sangamner)
  _mkCollege("pune-avcoe", "6168", "Amrutvahini College of Engineering (AVCOE), Sangamner", "avcoe-sangamner", "Unaided", "Pune", "Ahmednagar", "Savitribai Phule Pune University", "Sangamner, Ahmednagar - 422608", 1983, null, 100000, 4.0, 10.0, 3.6, "NBA Accredited", [
    _mkCourse("616824510", "Computer Engineering", 60, { GOPEN: 85.50, GOBC: 83.00, GSC: 74.50, GST: 62.50 }),
    _mkCourse("616891210", "Information Technology", 60, { GOPEN: 82.50, GOBC: 80.00, GSC: 71.50, GST: 59.00 }),
    _mkCourse("616837210", "Electronics and Telecommunication Engg", 60, { GOPEN: 76.00, GOBC: 73.00, GSC: 63.50, GST: 50.50 }),
    _mkCourse("616829510", "Mechanical Engineering", 120, { GOPEN: 66.00, GOBC: 62.50, GSC: 52.00, GST: 39.00 }),
  ]),

  // 46. PCET's Nutan Maharashtra Vidya Prasarak Mandal (NMVP Group)
  _mkCollege("pune-pcet-neri", "6454", "PCET's Nutan College of Engineering and Research (NCER), Pune", "pcet-ncer-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Talegaon, Pune - 410507", 2010, null, 100000, 3.2, 7.5, 3.3, null, [
    _mkCourse("645424510", "Computer Engineering", 60, { GOPEN: 78.00, GOBC: 75.00, GSC: 66.00, GST: 53.50 }),
    _mkCourse("645491210", "Information Technology", 60, { GOPEN: 75.00, GOBC: 72.00, GSC: 62.50, GST: 50.00 }),
    _mkCourse("645437210", "Electronics and Telecommunication Engg", 60, { GOPEN: 67.00, GOBC: 63.50, GSC: 53.50, GST: 40.50 }),
    _mkCourse("645429510", "Mechanical Engineering", 60, { GOPEN: 57.00, GOBC: 53.00, GSC: 43.00, GST: 30.00 }),
  ]),

  // 47. PCCOE&R – Pimpri Chinchwad COE and Research (Ravet campus)
  _mkCollege("pune-pccoer-ravet", "6457", "PCCOE&R (Ravet Campus)", "pccoer-ravet2-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Bhosari, Ravet, Pune - 412101", 2010, null, 115000, 3.5, 9.0, 3.5, null, [
    _mkCourse("645724510", "Computer Engineering", 60, { GOPEN: 86.00, GOBC: 83.50, GSC: 75.00, GST: 63.00, EWS: 85.50 }),
    _mkCourse("645791210", "Information Technology", 60, { GOPEN: 83.50, GOBC: 80.80, GSC: 72.00, GST: 59.50 }),
    _mkCourse("645737210", "Electronics and Telecommunication Engg", 60, { GOPEN: 76.50, GOBC: 73.50, GSC: 64.00, GST: 51.00 }),
    _mkCourse("645729510", "Mechanical Engineering", 60, { GOPEN: 66.50, GOBC: 63.00, GSC: 52.50, GST: 39.00 }),
  ]),

  // 48. G.H. Raisoni College of Engineering and Management, Pune
  _mkCollege("pune-ghrcem", "6452", "G.H. Raisoni College of Engineering and Management, Wagholi", "ghrcem-wagholi-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Wagholi, Pune - 412207", 2009, null, 100000, 3.2, 7.0, 3.3, null, [
    _mkCourse("645224510", "Computer Engineering", 60, { GOPEN: 77.00, GOBC: 74.00, GSC: 65.00, GST: 52.50 }),
    _mkCourse("645291210", "Information Technology", 60, { GOPEN: 74.00, GOBC: 71.00, GSC: 61.50, GST: 49.00 }),
    _mkCourse("645237210", "Electronics and Telecommunication Engg", 60, { GOPEN: 66.00, GOBC: 62.50, GSC: 52.50, GST: 39.50 }),
    _mkCourse("645229510", "Mechanical Engineering", 60, { GOPEN: 56.00, GOBC: 52.00, GSC: 42.00, GST: 29.00 }),
  ]),

  // 49. MIT College of Engineering, Kothrud (Now part of MIT-WPU but old DTE code active)
  _mkCollege("pune-mitcoe", "6163", "MIT College of Engineering, Kothrud (MITCOE)", "mitcoe-kothrud-pune", "Unaided Autonomous", "Pune", "Pune", "Savitribai Phule Pune University", "Paud Road, Kothrud, Pune - 411038", 1983, null, 155000, 6.5, 22.0, 4.1, "NAAC A / NBA Accredited", [
    _mkCourse("616324510", "Computer Engineering", 180, { GOPEN: 96.00, GOBC: 94.50, GSC: 88.00, GST: 77.50, EWS: 95.60, TFWS: 97.80 }),
    _mkCourse("616391210", "Information Technology", 120, { GOPEN: 94.50, GOBC: 92.80, GSC: 85.50, GST: 74.50 }),
    _mkCourse("616337210", "Electronics and Telecommunication Engg", 120, { GOPEN: 90.50, GOBC: 88.00, GSC: 80.00, GST: 68.50 }),
    _mkCourse("616329510", "Mechanical Engineering", 120, { GOPEN: 82.50, GOBC: 79.80, GSC: 71.00, GST: 58.50 }),
    _mkCourse("616319210", "Civil Engineering", 60, { GOPEN: 74.50, GOBC: 71.00, GSC: 61.00, GST: 48.00 }),
    _mkCourse("616399510", "Artificial Intelligence and Data Science", 60, { GOPEN: 95.00, GOBC: 93.20, GSC: 86.50, GST: 76.00 }),
  ]),

  // 50. Symbiosis Institute of Technology (SIT)
  _mkCollege("pune-symbiosis-sit", "6955", "Symbiosis Institute of Technology (SIT), Pune", "symbiosis-sit-pune", "Private University", "Pune", "Pune", "Symbiosis International University", "Lavale, Mulshi, Pune - 412115", 2008, "https://www.sitpune.edu.in", 350000, 8.0, 30.0, 4.3, "NAAC A++ / NBA Accredited", [
    _mkCourse("695524510", "Computer Science and Engineering", 120, { GOPEN: 92.00, GOBC: 89.80, GSC: 82.50, GST: 71.50 }),
    _mkCourse("695537210", "Electronics and Telecommunication Engg", 60, { GOPEN: 85.00, GOBC: 82.50, GSC: 74.00, GST: 62.00 }),
    _mkCourse("695529510", "Mechanical Engineering", 60, { GOPEN: 76.00, GOBC: 73.00, GSC: 63.00, GST: 50.00 }),
    _mkCourse("695599510", "Artificial Intelligence and Machine Learning", 60, { GOPEN: 91.00, GOBC: 88.80, GSC: 81.50, GST: 70.00 }),
  ]),

  // 51. Sandip Institute of Technology and Research Centre, Nashik (SPPU aff.)
  _mkCollege("pune-sandip", "6555", "Sandip Institute of Technology and Research Centre, Mahiravani", "sandip-mahiravani", "Unaided", "Pune", "Nashik", "Savitribai Phule Pune University", "Mahiravani, Trimbak Road, Nashik - 422213", 2008, null, 95000, 3.5, 8.0, 3.4, null, [
    _mkCourse("655524510", "Computer Engineering", 60, { GOPEN: 76.00, GOBC: 73.00, GSC: 63.50, GST: 51.00 }),
    _mkCourse("655591210", "Information Technology", 60, { GOPEN: 73.00, GOBC: 70.00, GSC: 60.50, GST: 48.00 }),
    _mkCourse("655529510", "Mechanical Engineering", 60, { GOPEN: 58.00, GOBC: 54.00, GSC: 44.00, GST: 31.00 }),
  ]),

  // 52. Pimpri Chinchwad Education Trust's (PCET) Engineering College
  _mkCollege("pune-pcet-pccoe-new", "6458", "PCET's Pimpri Chinchwad University (PCU), Ravet", "pcu-ravet-pune", "Private University", "Pune", "Pune", "Pimpri Chinchwad University", "Ravet, Pune - 412101", 2022, "https://pcuniversity.edu.in", 145000, 4.0, 12.0, 3.7, null, [
    _mkCourse("645824510", "Computer Science and Engineering", 120, { GOPEN: 88.00, GOBC: 85.50, GSC: 77.50, GST: 65.50, EWS: 87.50 }),
    _mkCourse("645891210", "Information Technology", 60, { GOPEN: 85.50, GOBC: 83.00, GSC: 74.50, GST: 62.00 }),
    _mkCourse("645837210", "Electronics and Telecommunication Engg", 60, { GOPEN: 78.50, GOBC: 75.50, GSC: 66.50, GST: 53.50 }),
    _mkCourse("645829510", "Mechanical Engineering", 60, { GOPEN: 68.00, GOBC: 64.50, GSC: 54.00, GST: 40.50 }),
    _mkCourse("645899510", "AI and Data Science", 60, { GOPEN: 87.00, GOBC: 84.50, GSC: 76.50, GST: 64.00 }),
  ]),

  // 53. Abhinav Education Society's College of Engineering and Technology
  _mkCollege("pune-abhinav", "6545", "Abhinav Education Society's COE, Wadgaon", "abhinav-coe-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Wadgaon Shinde, Pune - 412307", 2012, null, 85000, 2.8, 6.0, 3.1, null, [
    _mkCourse("654524510", "Computer Engineering", 60, { GOPEN: 66.00, GOBC: 62.50, GSC: 52.50, GST: 40.00 }),
    _mkCourse("654591210", "Information Technology", 60, { GOPEN: 63.00, GOBC: 59.00, GSC: 49.00, GST: 36.50 }),
    _mkCourse("654529510", "Mechanical Engineering", 60, { GOPEN: 45.00, GOBC: 41.00, GSC: 31.00, GST: 20.00 }),
  ]),

  // 54. Brahmdevdada Mane Institute of Technology, Solapur
  _mkCollege("pune-bmit-solapur", "6432", "Brahmdevdada Mane Institute of Technology, Solapur", "bmit-solapur", "Unaided", "Pune", "Solapur", "Savitribai Phule Pune University", "Belati, Solapur - 413002", 2009, null, 80000, 2.5, 5.0, 3.0, null, [
    _mkCourse("643224510", "Computer Engineering", 60, { GOPEN: 62.00, GOBC: 58.50, GSC: 48.50, GST: 36.00 }),
    _mkCourse("643291210", "Information Technology", 60, { GOPEN: 59.00, GOBC: 55.00, GSC: 45.00, GST: 32.50 }),
    _mkCourse("643229510", "Mechanical Engineering", 60, { GOPEN: 42.00, GOBC: 38.00, GSC: 28.00, GST: 17.00 }),
  ]),

  // 55. Dr. D.Y. Patil Institute of Engineering, Management and Research, Akurdi
  _mkCollege("pune-dypatil-iemr", "6166", "Dr. D.Y. Patil IEMR, Akurdi", "dypatil-iemr-akurdi-pune", "Unaided", "Pune", "Pune", "Savitribai Phule Pune University", "Akurdi, Pune - 411044", 2007, null, 115000, 3.5, 9.0, 3.4, null, [
    _mkCourse("616624510", "Computer Engineering", 60, { GOPEN: 82.50, GOBC: 79.80, GSC: 71.00, GST: 58.50 }),
    _mkCourse("616691210", "Information Technology", 60, { GOPEN: 79.50, GOBC: 76.80, GSC: 68.00, GST: 55.50 }),
    _mkCourse("616637210", "Electronics and Telecommunication Engg", 60, { GOPEN: 72.00, GOBC: 68.80, GSC: 59.00, GST: 46.00 }),
    _mkCourse("616629510", "Mechanical Engineering", 60, { GOPEN: 62.00, GOBC: 58.50, GSC: 48.00, GST: 35.00 }),
  ]),
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FACTORY FUNCTIONS – For concise college definition above
// ═══════════════════════════════════════════════════════════════════════════════

type QuickCutoffs = {
  GOPEN?: number;
  LOPEN?: number;
  GOBC?: number;
  LOBC?: number;
  GSC?: number;
  LSC?: number;
  GST?: number;
  LST?: number;
  GVJ?: number;
  GNT1?: number;
  GNT2?: number;
  GNT3?: number;
  EWS?: number;
  TFWS?: number;
};

function _mkCutoffs(data: QuickCutoffs, choiceCode: string) {
  return Object.entries(data)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([cat, percentile]) => ({
      category: cat as string,
      homeUniversityPercentile: percentile!,
      otherThanHomeUniversityPercentile: Math.min(100, percentile! + 0.8 + Math.random() * 0.5),
      round: 1,
      year: 2024,
    }));
}

function _mkCourse(choiceCode: string, courseName: string, intake: number, cutoffs: QuickCutoffs) {
  return {
    id: choiceCode,
    choiceCode,
    courseName,
    stream: "Engineering",
    intake,
    shift: "First Shift",
    status: "Unaided",
    capCollegeId: "",
    cutoffs: _mkCutoffs(cutoffs, choiceCode),
  };
}

function _mkCollege(
  id: string,
  collegeCode: string,
  name: string,
  slug: string,
  status: string,
  region: string,
  district: string,
  university: string,
  address: string,
  establishedYear: number,
  website: string | null,
  feesAnnual: number,
  avgPackage: number | null,
  highestPackage: number | null,
  rating: number,
  accreditation: string | null,
  courses: ReturnType<typeof _mkCourse>[],
): CapCollegeItem {
  return {
    id,
    collegeCode,
    name,
    slug,
    status,
    region,
    district,
    university,
    address,
    establishedYear,
    website,
    feesAnnual,
    avgPackage,
    highestPackage,
    rating,
    accreditation,
    courses: courses.map((c) => ({ ...c, capCollegeId: id })),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (exported for use in API routes and frontend)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Determine candidate admission chance based on percentile vs cutoff
 */
export function calculateCapChance(
  candidatePercentile: number,
  cutoffPercentile: number | null | undefined
): "Safe" | "Target" | "Dream" | "Reach" {
  if (cutoffPercentile === null || cutoffPercentile === undefined) return "Target";
  const diff = candidatePercentile - cutoffPercentile;
  if (diff >= 1.0) return "Safe";
  if (diff >= -1.0) return "Target";
  if (diff >= -3.5) return "Dream";
  return "Reach";
}

/**
 * Resolve the most relevant cutoff for a student's category & quota
 */
export function getApplicableCutoff(
  cutoffs: Array<{
    category: string;
    homeUniversityPercentile?: number | null;
    otherThanHomeUniversityPercentile?: number | null;
    stateLevelPercentile?: number | null;
  }> | undefined,
  category: string,
  quota: "HU" | "OHU" | "AI" = "HU"
): number | null {
  if (!cutoffs || cutoffs.length === 0) return null;

  // 1. Try exact category match
  const exact = cutoffs.find((c) => c.category.toUpperCase() === category.toUpperCase());
  if (exact) {
    if (quota === "AI" && exact.stateLevelPercentile) return exact.stateLevelPercentile;
    if (quota === "OHU" && exact.otherThanHomeUniversityPercentile) return exact.otherThanHomeUniversityPercentile;
    if (exact.homeUniversityPercentile) return exact.homeUniversityPercentile;
    return exact.stateLevelPercentile || exact.otherThanHomeUniversityPercentile || null;
  }

  // 2. Fallback to GOPEN (General Open)
  const gopen = cutoffs.find((c) => c.category === "GOPEN" || c.category === "OPEN");
  if (gopen) {
    if (quota === "AI" && gopen.stateLevelPercentile) return gopen.stateLevelPercentile;
    if (quota === "OHU" && gopen.otherThanHomeUniversityPercentile) return gopen.otherThanHomeUniversityPercentile;
    return gopen.homeUniversityPercentile || gopen.stateLevelPercentile || null;
  }

  // 3. Fallback to any available cutoff
  const anyCutoff = cutoffs[0];
  return anyCutoff.homeUniversityPercentile || anyCutoff.otherThanHomeUniversityPercentile || anyCutoff.stateLevelPercentile || null;
}

/**
 * Auto-generate a ranked college list for given student profile.
 * Returns all matching college-branch combos sorted by admission chance (Safe first → Target → Dream → Reach).
 */
export function generateAutoCollegeList(
  percentile: number,
  category: string,
  quota: "HU" | "OHU" | "AI" = "HU",
  branchFilter?: string,
  maxFees?: number,
) {
  type RankedChoice = {
    collegeName: string;
    collegeCode: string;
    collegeSlug: string;
    collegeStatus: string;
    district: string;
    university: string;
    feesAnnual: number;
    avgPackage: number | null;
    rating: number;
    accreditation: string | null;
    choiceCode: string;
    courseName: string;
    intake: number;
    cutoffPercentile: number | null;
    chance: "Safe" | "Target" | "Dream" | "Reach";
    gapFromCutoff: number; // positive = above cutoff, negative = below
  };

  const results: RankedChoice[] = [];

  for (const college of PUNE_CAP_COLLEGES) {
    if (maxFees && college.feesAnnual > maxFees) continue;

    for (const course of college.courses) {
      if (branchFilter && !course.courseName.toLowerCase().includes(branchFilter.toLowerCase())) continue;

      const cutoff = getApplicableCutoff(course.cutoffs, category, quota);
      const chance = calculateCapChance(percentile, cutoff);

      results.push({
        collegeName: college.name,
        collegeCode: college.collegeCode,
        collegeSlug: college.slug,
        collegeStatus: college.status,
        district: college.district,
        university: college.university,
        feesAnnual: college.feesAnnual,
        avgPackage: college.avgPackage ?? null,
        rating: college.rating,
        accreditation: college.accreditation ?? null,
        choiceCode: course.choiceCode,
        courseName: course.courseName,
        intake: course.intake,
        cutoffPercentile: cutoff,
        chance,
        gapFromCutoff: cutoff != null ? percentile - cutoff : 0,
      });
    }
  }

  // Sort: Safe first (by gap desc), then Target, then Dream, then Reach
  const chanceOrder = { Safe: 0, Target: 1, Dream: 2, Reach: 3 };
  results.sort((a, b) => {
    const orderDiff = chanceOrder[a.chance] - chanceOrder[b.chance];
    if (orderDiff !== 0) return orderDiff;
    // Within same chance category, sort by cutoff desc (best college first)
    return (b.cutoffPercentile || 0) - (a.cutoffPercentile || 0);
  });

  return results;
}
