import { PrismaClient, CollegeType, ScholarshipType, ScholarshipLevel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/collegecompass?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Helper ──────────────────────────────────────────────────────

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function roundTo(n: number, d: number): number {
  return Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
}

// ─── Seed Data Arrays ───────────────────────────────────────────

const _STATES_CITIES: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  Delhi: ["New Delhi"],
  "Uttar Pradesh": ["Noida", "Lucknow", "Kanpur", "Varanasi"],
  Telangana: ["Hyderabad", "Warangal"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur"],
  "West Bengal": ["Kolkata", "Kharagpur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  Punjab: ["Chandigarh", "Ludhiana", "Amritsar"],
  Haryana: ["Gurugram", "Faridabad"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati"],
  Odisha: ["Bhubaneswar", "Rourkela"],
};

const AFFILIATIONS = [
  "AICTE",
  "UGC",
  "Autonomous",
  "State University",
  "Deemed University",
  "Central University",
  "National Institute",
];

const ACCREDITATIONS = [
  "NAAC A++",
  "NAAC A+",
  "NAAC A",
  "NAAC B++",
  "NAAC B+",
  "NBA Accredited",
  null,
];

const _STREAMS = [
  "Engineering",
  "Management",
  "Medical",
  "Science",
  "Commerce",
  "Arts",
  "Law",
  "Pharmacy",
];

const ENGINEERING_COURSES = [
  { name: "Computer Science and Engineering", slug: "cse", eligibility: "10+2 with PCM, JEE/State CET" },
  { name: "Electronics and Communication Engineering", slug: "ece", eligibility: "10+2 with PCM, JEE/State CET" },
  { name: "Mechanical Engineering", slug: "me", eligibility: "10+2 with PCM, JEE/State CET" },
  { name: "Civil Engineering", slug: "ce", eligibility: "10+2 with PCM, JEE/State CET" },
  { name: "Electrical Engineering", slug: "ee", eligibility: "10+2 with PCM, JEE/State CET" },
  { name: "Information Technology", slug: "it", eligibility: "10+2 with PCM, JEE/State CET" },
  { name: "Artificial Intelligence and Data Science", slug: "aids", eligibility: "10+2 with PCM, JEE/State CET" },
  { name: "Chemical Engineering", slug: "che", eligibility: "10+2 with PCM, JEE/State CET" },
];

const MANAGEMENT_COURSES = [
  { name: "MBA", slug: "mba", eligibility: "Graduate degree, CAT/MAT/XAT" },
  { name: "BBA", slug: "bba", eligibility: "10+2 any stream" },
  { name: "MBA in Finance", slug: "mba-finance", eligibility: "Graduate degree, CAT/MAT" },
  { name: "MBA in Marketing", slug: "mba-marketing", eligibility: "Graduate degree, CAT/MAT" },
];

const MEDICAL_COURSES = [
  { name: "MBBS", slug: "mbbs", eligibility: "10+2 with PCB, NEET" },
  { name: "BDS", slug: "bds", eligibility: "10+2 with PCB, NEET" },
  { name: "B.Pharma", slug: "bpharma", eligibility: "10+2 with PCB/PCM" },
];

const SCIENCE_COURSES = [
  { name: "B.Sc Computer Science", slug: "bsc-cs", eligibility: "10+2 with Science" },
  { name: "B.Sc Physics", slug: "bsc-physics", eligibility: "10+2 with PCM" },
  { name: "M.Sc Computer Science", slug: "msc-cs", eligibility: "B.Sc in relevant field" },
];

const _EXAMS = ["JEE Main", "MHT-CET", "KCET", "AP EAMCET", "WBJEE", "COMEDK"];
const _CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];

const REVIEW_TITLES = [
  "Great learning experience",
  "Good college, decent placements",
  "Excellent faculty and infrastructure",
  "Average experience overall",
  "Would recommend to others",
  "Strong technical curriculum",
  "Good campus life",
  "Placements are improving every year",
  "Quality education at reasonable fees",
  "Well-managed institution",
  "Needs improvement in some areas",
  "Solid engineering college",
  "Good for technical courses",
  "Supportive faculty members",
  "Value for money education",
];

const REVIEW_COMMENTS = [
  "The college has good infrastructure and well-equipped labs. Faculty members are knowledgeable and approachable. Campus placements have been consistent over the years.",
  "Decent college with a focus on practical learning. The placement cell is active and brings good companies. Hostel facilities could be better.",
  "Strong academic curriculum with industry-relevant courses. Regular workshops and seminars help in skill development. The library is well-stocked.",
  "The campus is well-maintained and the teaching quality is good. Extra-curricular activities are encouraged. Some departments are stronger than others.",
  "Good exposure to industry through internships and projects. The alumni network is helpful for career guidance. Fees are reasonable for the quality offered.",
  "Faculty quality varies across departments but overall it is a good institution. Lab facilities are adequate. The college has a good reputation in the region.",
  "The placement record has been improving steadily. Students get opportunities in both core and IT companies. Sports and cultural facilities are available.",
  "Well-structured courses with emphasis on fundamentals. Regular assignments and assessments ensure continuous learning. Could improve the sports facilities.",
];

// ─── College Templates ──────────────────────────────────────────

interface CollegeTemplate {
  name: string;
  state: string;
  city: string;
  type: CollegeType;
  tier: "top" | "mid" | "standard";
  streams: string[];
}

const COLLEGE_TEMPLATES: CollegeTemplate[] = [
  // Maharashtra
  { name: "Indian Institute of Technology Bombay", state: "Maharashtra", city: "Mumbai", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "College of Engineering Pune", state: "Maharashtra", city: "Pune", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "Veermata Jijabai Technological Institute", state: "Maharashtra", city: "Mumbai", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "Pune Institute of Computer Technology", state: "Maharashtra", city: "Pune", type: "PRIVATE", tier: "mid", streams: ["Engineering"] },
  { name: "Vishwakarma Institute of Technology", state: "Maharashtra", city: "Pune", type: "PRIVATE", tier: "mid", streams: ["Engineering"] },
  { name: "Cummins College of Engineering for Women", state: "Maharashtra", city: "Pune", type: "PRIVATE", tier: "mid", streams: ["Engineering"] },
  { name: "Maharashtra Institute of Technology", state: "Maharashtra", city: "Pune", type: "PRIVATE", tier: "mid", streams: ["Engineering", "Management"] },
  { name: "Savitribai Phule Pune University", state: "Maharashtra", city: "Pune", type: "GOVERNMENT", tier: "mid", streams: ["Science", "Arts", "Commerce"] },
  { name: "Visvesvaraya National Institute of Technology Nagpur", state: "Maharashtra", city: "Nagpur", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "Symbiosis International University", state: "Maharashtra", city: "Pune", type: "DEEMED", tier: "top", streams: ["Management", "Law", "Arts"] },
  { name: "Walchand College of Engineering Sangli", state: "Maharashtra", city: "Nashik", type: "GOVERNMENT", tier: "mid", streams: ["Engineering"] },
  
  // Karnataka
  { name: "Indian Institute of Science Bangalore", state: "Karnataka", city: "Bangalore", type: "GOVERNMENT", tier: "top", streams: ["Science", "Engineering"] },
  { name: "RV College of Engineering", state: "Karnataka", city: "Bangalore", type: "PRIVATE", tier: "top", streams: ["Engineering"] },
  { name: "BMS College of Engineering", state: "Karnataka", city: "Bangalore", type: "PRIVATE", tier: "top", streams: ["Engineering"] },
  { name: "PES University", state: "Karnataka", city: "Bangalore", type: "DEEMED", tier: "top", streams: ["Engineering", "Management"] },
  { name: "MS Ramaiah Institute of Technology", state: "Karnataka", city: "Bangalore", type: "PRIVATE", tier: "mid", streams: ["Engineering"] },
  { name: "Dayananda Sagar College of Engineering", state: "Karnataka", city: "Bangalore", type: "PRIVATE", tier: "mid", streams: ["Engineering"] },
  { name: "National Institute of Technology Karnataka Surathkal", state: "Karnataka", city: "Mangalore", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "JSS Science and Technology University", state: "Karnataka", city: "Mysore", type: "DEEMED", tier: "mid", streams: ["Engineering", "Science"] },

  // Tamil Nadu
  { name: "Indian Institute of Technology Madras", state: "Tamil Nadu", city: "Chennai", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "Anna University", state: "Tamil Nadu", city: "Chennai", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "PSG College of Technology", state: "Tamil Nadu", city: "Coimbatore", type: "AUTONOMOUS", tier: "top", streams: ["Engineering", "Management"] },
  { name: "SSN College of Engineering", state: "Tamil Nadu", city: "Chennai", type: "AUTONOMOUS", tier: "top", streams: ["Engineering"] },
  { name: "SRM Institute of Science and Technology", state: "Tamil Nadu", city: "Chennai", type: "DEEMED", tier: "mid", streams: ["Engineering", "Management", "Medical"] },
  { name: "VIT University", state: "Tamil Nadu", city: "Coimbatore", type: "DEEMED", tier: "top", streams: ["Engineering", "Science", "Management"] },
  { name: "Thiagarajar College of Engineering", state: "Tamil Nadu", city: "Madurai", type: "AUTONOMOUS", tier: "mid", streams: ["Engineering"] },
  
  // Delhi
  { name: "Indian Institute of Technology Delhi", state: "Delhi", city: "New Delhi", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "Delhi Technological University", state: "Delhi", city: "New Delhi", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "Netaji Subhas University of Technology", state: "Delhi", city: "New Delhi", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "Indraprastha Institute of Information Technology", state: "Delhi", city: "New Delhi", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "Jamia Millia Islamia", state: "Delhi", city: "New Delhi", type: "GOVERNMENT", tier: "mid", streams: ["Engineering", "Arts", "Science"] },
  
  // Uttar Pradesh
  { name: "Indian Institute of Technology Kanpur", state: "Uttar Pradesh", city: "Kanpur", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "Indian Institute of Technology BHU Varanasi", state: "Uttar Pradesh", city: "Varanasi", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "Motilal Nehru National Institute of Technology Allahabad", state: "Uttar Pradesh", city: "Lucknow", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "Amity University Noida", state: "Uttar Pradesh", city: "Noida", type: "PRIVATE", tier: "mid", streams: ["Engineering", "Management", "Law"] },
  { name: "JIIT Noida", state: "Uttar Pradesh", city: "Noida", type: "DEEMED", tier: "mid", streams: ["Engineering"] },
  
  // Telangana
  { name: "Indian Institute of Technology Hyderabad", state: "Telangana", city: "Hyderabad", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "International Institute of Information Technology Hyderabad", state: "Telangana", city: "Hyderabad", type: "DEEMED", tier: "top", streams: ["Engineering", "Science"] },
  { name: "Osmania University", state: "Telangana", city: "Hyderabad", type: "GOVERNMENT", tier: "mid", streams: ["Engineering", "Science", "Arts"] },
  { name: "Chaitanya Bharathi Institute of Technology", state: "Telangana", city: "Hyderabad", type: "PRIVATE", tier: "mid", streams: ["Engineering"] },
  { name: "National Institute of Technology Warangal", state: "Telangana", city: "Warangal", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  
  // Gujarat
  { name: "Indian Institute of Technology Gandhinagar", state: "Gujarat", city: "Ahmedabad", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "Nirma University", state: "Gujarat", city: "Ahmedabad", type: "PRIVATE", tier: "mid", streams: ["Engineering", "Management", "Pharmacy"] },
  { name: "Dhirubhai Ambani Institute of Information and Communication Technology", state: "Gujarat", city: "Ahmedabad", type: "PRIVATE", tier: "top", streams: ["Engineering"] },
  { name: "SVNIT Surat", state: "Gujarat", city: "Surat", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  
  // Rajasthan
  { name: "Indian Institute of Technology Jodhpur", state: "Rajasthan", city: "Jodhpur", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "Malaviya National Institute of Technology Jaipur", state: "Rajasthan", city: "Jaipur", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "Birla Institute of Technology and Science Pilani", state: "Rajasthan", city: "Jaipur", type: "DEEMED", tier: "top", streams: ["Engineering", "Science", "Pharmacy"] },
  { name: "Manipal University Jaipur", state: "Rajasthan", city: "Jaipur", type: "PRIVATE", tier: "mid", streams: ["Engineering", "Management"] },
  
  // West Bengal
  { name: "Indian Institute of Technology Kharagpur", state: "West Bengal", city: "Kharagpur", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science", "Management"] },
  { name: "Jadavpur University", state: "West Bengal", city: "Kolkata", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Arts", "Science"] },
  { name: "Indian Institute of Engineering Science and Technology Shibpur", state: "West Bengal", city: "Kolkata", type: "GOVERNMENT", tier: "mid", streams: ["Engineering"] },
  
  // Madhya Pradesh
  { name: "Indian Institute of Technology Indore", state: "Madhya Pradesh", city: "Indore", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "Maulana Azad National Institute of Technology Bhopal", state: "Madhya Pradesh", city: "Bhopal", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "Indian Institute of Information Technology Gwalior", state: "Madhya Pradesh", city: "Gwalior", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  
  // Kerala
  { name: "National Institute of Technology Calicut", state: "Kerala", city: "Kozhikode", type: "GOVERNMENT", tier: "top", streams: ["Engineering"] },
  { name: "College of Engineering Trivandrum", state: "Kerala", city: "Thiruvananthapuram", type: "GOVERNMENT", tier: "mid", streams: ["Engineering"] },
  { name: "Cochin University of Science and Technology", state: "Kerala", city: "Kochi", type: "GOVERNMENT", tier: "mid", streams: ["Engineering", "Science"] },
  
  // Punjab / Haryana
  { name: "Indian Institute of Technology Ropar", state: "Punjab", city: "Chandigarh", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "Thapar Institute of Engineering and Technology", state: "Punjab", city: "Chandigarh", type: "DEEMED", tier: "top", streams: ["Engineering"] },
  { name: "PEC University of Technology Chandigarh", state: "Punjab", city: "Chandigarh", type: "GOVERNMENT", tier: "mid", streams: ["Engineering"] },
  
  // Andhra Pradesh
  { name: "Indian Institute of Technology Tirupati", state: "Andhra Pradesh", city: "Tirupati", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "NIT Andhra Pradesh", state: "Andhra Pradesh", city: "Vijayawada", type: "GOVERNMENT", tier: "mid", streams: ["Engineering"] },
  { name: "Andhra University College of Engineering", state: "Andhra Pradesh", city: "Visakhapatnam", type: "GOVERNMENT", tier: "mid", streams: ["Engineering"] },
  
  // Odisha
  { name: "National Institute of Technology Rourkela", state: "Odisha", city: "Rourkela", type: "GOVERNMENT", tier: "top", streams: ["Engineering", "Science"] },
  { name: "International Institute of Information Technology Bhubaneswar", state: "Odisha", city: "Bhubaneswar", type: "GOVERNMENT", tier: "mid", streams: ["Engineering"] },
  
  // Additional Private/Deemed
  { name: "Manipal Institute of Technology", state: "Karnataka", city: "Mangalore", type: "DEEMED", tier: "top", streams: ["Engineering", "Management"] },
  { name: "BITS Goa", state: "Maharashtra", city: "Mumbai", type: "DEEMED", tier: "top", streams: ["Engineering", "Science"] },
  { name: "Shiv Nadar University", state: "Uttar Pradesh", city: "Noida", type: "PRIVATE", tier: "top", streams: ["Engineering", "Science", "Arts"] },
  { name: "IIIT Bangalore", state: "Karnataka", city: "Bangalore", type: "DEEMED", tier: "top", streams: ["Engineering"] },
  { name: "Kalinga Institute of Industrial Technology", state: "Odisha", city: "Bhubaneswar", type: "DEEMED", tier: "mid", streams: ["Engineering", "Management", "Medical"] },
  { name: "Vellore Institute of Technology Bhopal", state: "Madhya Pradesh", city: "Bhopal", type: "PRIVATE", tier: "mid", streams: ["Engineering", "Science"] },
  { name: "Christ University", state: "Karnataka", city: "Bangalore", type: "DEEMED", tier: "mid", streams: ["Management", "Arts", "Commerce", "Science"] },
  { name: "Lovely Professional University", state: "Punjab", city: "Ludhiana", type: "PRIVATE", tier: "standard", streams: ["Engineering", "Management", "Science", "Arts"] },
  { name: "Bennett University", state: "Uttar Pradesh", city: "Noida", type: "PRIVATE", tier: "mid", streams: ["Engineering", "Management", "Law"] },
  { name: "Chandigarh University", state: "Punjab", city: "Chandigarh", type: "PRIVATE", tier: "mid", streams: ["Engineering", "Management", "Science"] },
];

// ─── Data generation helpers ────────────────────────────────────

function getFeesRange(tier: string, type: CollegeType): [number, number] {
  if (type === "GOVERNMENT") {
    if (tier === "top") return [100000, 250000];
    if (tier === "mid") return [50000, 150000];
    return [30000, 80000];
  }
  if (type === "DEEMED") {
    if (tier === "top") return [300000, 600000];
    if (tier === "mid") return [200000, 450000];
    return [150000, 300000];
  }
  // PRIVATE / AUTONOMOUS
  if (tier === "top") return [250000, 500000];
  if (tier === "mid") return [150000, 350000];
  return [80000, 200000];
}

function getPlacementData(tier: string): { avg: number; highest: number; rate: number } {
  if (tier === "top") {
    return {
      avg: roundTo(rand(800, 2000) / 100, 1),   // 8-20 LPA
      highest: roundTo(rand(2000, 5000) / 100, 1), // 20-50 LPA
      rate: rand(85, 98),
    };
  }
  if (tier === "mid") {
    return {
      avg: roundTo(rand(400, 900) / 100, 1),    // 4-9 LPA
      highest: roundTo(rand(1000, 2500) / 100, 1), // 10-25 LPA
      rate: rand(70, 90),
    };
  }
  return {
    avg: roundTo(rand(250, 500) / 100, 1),      // 2.5-5 LPA
    highest: roundTo(rand(600, 1200) / 100, 1),    // 6-12 LPA
    rate: rand(55, 75),
  };
}

function getRating(tier: string): number {
  if (tier === "top") return roundTo(rand(40, 48) / 10, 1);   // 4.0-4.8
  if (tier === "mid") return roundTo(rand(35, 43) / 10, 1);   // 3.5-4.3
  return roundTo(rand(30, 38) / 10, 1);                        // 3.0-3.8
}

function getEstablishedYear(tier: string): number {
  if (tier === "top") return rand(1847, 1980);
  if (tier === "mid") return rand(1960, 2005);
  return rand(1990, 2015);
}

function getCoursesForStreams(streams: string[], feesBase: number): Array<{
  name: string;
  slug: string;
  duration: string;
  stream: string;
  fees: number;
  eligibility: string;
}> {
  const courses: Array<{
    name: string;
    slug: string;
    duration: string;
    stream: string;
    fees: number;
    eligibility: string;
  }> = [];

  for (const stream of streams) {
    let streamCourses: typeof ENGINEERING_COURSES = [];
    let duration = "4 Years";

    switch (stream) {
      case "Engineering":
        streamCourses = ENGINEERING_COURSES.slice(0, rand(3, 6));
        duration = "4 Years";
        break;
      case "Management":
        streamCourses = MANAGEMENT_COURSES.slice(0, rand(2, 4));
        duration = "2 Years";
        break;
      case "Medical":
        streamCourses = MEDICAL_COURSES.slice(0, rand(1, 3));
        duration = "5 Years";
        break;
      case "Science":
        streamCourses = SCIENCE_COURSES.slice(0, rand(2, 3));
        duration = "3 Years";
        break;
      default:
        continue;
    }

    for (const c of streamCourses) {
      const feeVariation = rand(80, 130) / 100;
      courses.push({
        name: c.name,
        slug: c.slug,
        duration,
        stream,
        fees: Math.round(feesBase * feeVariation / 1000) * 1000,
        eligibility: c.eligibility,
      });
    }
  }

  return courses;
}

function getCutoffData(
  collegeName: string,
  state: string,
  tier: string,
  courses: Array<{ name: string }>
): Array<{
  exam: string;
  category: string;
  course: string;
  closingRank: number;
  year: number;
}> {
  const cutoffs: Array<{
    exam: string;
    category: string;
    course: string;
    closingRank: number;
    year: number;
  }> = [];

  // Determine which exams this college accepts
  const examSet: string[] = [];
  if (state === "Maharashtra") examSet.push("JEE Main", "MHT-CET");
  else if (state === "Karnataka") examSet.push("JEE Main", "KCET", "COMEDK");
  else if (state === "Andhra Pradesh" || state === "Telangana") examSet.push("JEE Main", "AP EAMCET");
  else if (state === "West Bengal") examSet.push("JEE Main", "WBJEE");
  else examSet.push("JEE Main");

  // IITs only take JEE Advanced (use JEE Main as proxy)
  if (collegeName.includes("Indian Institute of Technology")) {
    examSet.length = 0;
    examSet.push("JEE Main");
  }

  const baseRank = tier === "top" ? rand(500, 8000) : tier === "mid" ? rand(8000, 40000) : rand(30000, 80000);

  for (const exam of examSet) {
    for (const category of ["General", "OBC", "SC", "EWS"]) {
      // Pick 1-2 courses for cutoff data
      const selectedCourses = courses.slice(0, Math.min(2, courses.length));
      for (const course of selectedCourses) {
        let rankMultiplier = 1;
        if (category === "OBC") rankMultiplier = 1.3;
        if (category === "SC") rankMultiplier = 2.0;
        if (category === "EWS") rankMultiplier = 1.2;

        const rankJitter = rand(80, 120) / 100;
        const closingRank = Math.round(baseRank * rankMultiplier * rankJitter);

        cutoffs.push({
          exam,
          category,
          course: course.name,
          closingRank,
          year: 2024,
        });
      }
    }
  }

  return cutoffs;
}

function generateDescription(name: string, city: string, state: string, year: number, type: CollegeType): string {
  const typeStr = type === "GOVERNMENT" ? "government" : type === "PRIVATE" ? "private" : type === "DEEMED" ? "deemed" : "autonomous";
  return `${name} is a ${typeStr} institution located in ${city}, ${state}, established in ${year}. The institution offers undergraduate and postgraduate programs across multiple disciplines. With a focus on academic excellence and industry-relevant curriculum, the college has built a strong reputation for producing skilled graduates. The campus provides modern facilities including well-equipped laboratories, library resources, and spaces for co-curricular activities.`;
}

// ─── Main Seed Function ─────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("  Clearing existing data...");
  await prisma.cutoffData.deleteMany();
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  console.log("  Creating demo user...");
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@collegecompass.in",
      hashedPassword: await hash("demo1234", 12),
    },
  });

  // Create colleges
  console.log("  Creating colleges...");
  let collegeCount = 0;
  let courseCount = 0;
  let cutoffCount = 0;
  let reviewCount = 0;
  const MAX_COLLEGES = 20;

  for (const template of COLLEGE_TEMPLATES) {
  if (collegeCount >= MAX_COLLEGES) {
    console.log(`  Reached max of ${MAX_COLLEGES} colleges, stopping seed.`);
    break;
  }
  const [feesMin, feesMax] = getFeesRange(template.tier, template.type);
  const placement = getPlacementData(template.tier);
  const rating = getRating(template.tier);
  const establishedYear = getEstablishedYear(template.tier);
  const numReviews = rand(5, 25);

  const college = await prisma.college.create({
    data: {
      name: template.name,
      slug: slug(template.name),
      description: generateDescription(template.name, template.city, template.state, establishedYear, template.type),
      city: template.city,
      state: template.state,
      type: template.type,
      establishedYear,
      affiliation: pick(AFFILIATIONS),
      accreditation: pick(ACCREDITATIONS),
      website: `https://www.${slug(template.name)}.ac.in`,
      rating,
      reviewCount: numReviews,
      feesMin,
      feesMax,
      avgPackage: placement.avg,
      highestPackage: placement.highest,
      placementRate: placement.rate,
    },
  });
  console.log(`  Created college ${college.name}`);
  collegeCount++;

  // Create courses
  const courses = getCoursesForStreams(template.streams, (feesMin + feesMax) / 2);
  for (const course of courses) {
    await prisma.course.create({
      data: { ...course, collegeId: college.id },
    });
    courseCount++;
  }

  // Create cutoff data (only for engineering)
  if (template.streams.includes("Engineering")) {
    const cutoffs = getCutoffData(template.name, template.state, template.tier, courses);
    for (const cutoff of cutoffs) {
      await prisma.cutoffData.create({ data: { ...cutoff, collegeId: college.id } });
      cutoffCount++;
    }
  }

  // Create reviews
  const reviewsToCreate = rand(3, 8);
  for (let r = 0; r < reviewsToCreate; r++) {
    await prisma.review.create({
      data: {
        rating: rand(3, 5),
        title: pick(REVIEW_TITLES),
        comment: pick(REVIEW_COMMENTS),
        userId: demoUser.id,
        collegeId: college.id,
      },
    });
    reviewCount++;
  }
}

  // ─── Scholarships ──────────────────────────────────────────────
  console.log("\n📚 Seeding scholarships...");

  const scholarships: Array<{
    name: string;
    provider: string;
    description: string;
    type: ScholarshipType;
    level: ScholarshipLevel;
    amount: string;
    eligibility: string;
    deadline: string | null;
    applicationLink: string | null;
    streams: string[];
    categories: string[];
  }> = [
    // ── National Government Scholarships ──
    {
      name: "PM Vidyalaxmi Scheme",
      provider: "Government of India",
      description: "A flagship initiative providing financial support to meritorious students from economically weaker sections for pursuing higher education in top institutions across India.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.NATIONAL,
      amount: "Full tuition fee coverage + ₹20,000/year living allowance",
      eligibility: "Family income below ₹8 LPA, admitted to NAAC/NBA accredited institutions",
      deadline: "31st October",
      applicationLink: "https://www.vidyalaxmi.co.in",
      streams: ["Engineering", "Medical", "Management", "Law", "Arts", "Science", "Commerce"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "AICTE Pragati Scholarship for Girls",
      provider: "All India Council for Technical Education",
      description: "Scholarship for girl students admitted to AICTE-approved institutions in first year of degree/diploma programs. Promotes women in technical education.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.NATIONAL,
      amount: "₹50,000/year (up to 4 years)",
      eligibility: "Girl students in AICTE-approved institutions, family income below ₹8 LPA",
      deadline: "31st December",
      applicationLink: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
      streams: ["Engineering", "Architecture", "Pharmacy"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Central Sector Scheme of Scholarships (CSSS)",
      provider: "Ministry of Education, Government of India",
      description: "Merit-based scholarship for students scoring above 80th percentile in Class 12 board exams, pursuing regular courses in colleges/universities.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.NATIONAL,
      amount: "₹12,000/year (UG), ₹20,000/year (PG)",
      eligibility: "Above 80th percentile in Class 12, family income below ₹4.5 LPA",
      deadline: "31st October",
      applicationLink: "https://scholarships.gov.in",
      streams: ["Engineering", "Medical", "Management", "Law", "Arts", "Science", "Commerce"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "INSPIRE Scholarship (SHE)",
      provider: "Department of Science & Technology, Government of India",
      description: "Innovation in Science Pursuit for Inspired Research — Scholarship for Higher Education (SHE) component supports students pursuing natural and basic science courses.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.NATIONAL,
      amount: "₹80,000/year",
      eligibility: "Top 1% in Class 12 board exams or JEE/NEET qualified, pursuing B.Sc./M.Sc. in Natural Sciences",
      deadline: "31st October",
      applicationLink: "https://online-inspire.gov.in",
      streams: ["Science"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Post-Matric Scholarship for SC Students",
      provider: "Ministry of Social Justice & Empowerment",
      description: "Centrally sponsored scheme providing financial assistance to Scheduled Caste students studying at post-matriculation levels to enable them to complete education.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.NATIONAL,
      amount: "Full tuition fees + ₹1,200/month maintenance allowance",
      eligibility: "SC category students, family income below ₹2.5 LPA",
      deadline: "31st October",
      applicationLink: "https://scholarships.gov.in",
      streams: ["Engineering", "Medical", "Management", "Law", "Arts", "Science", "Commerce"],
      categories: ["SC"],
    },
    {
      name: "Post-Matric Scholarship for ST Students",
      provider: "Ministry of Tribal Affairs",
      description: "Financial assistance for Scheduled Tribe students studying at post-matriculation levels, covering tuition fees, maintenance allowance, and study materials.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.NATIONAL,
      amount: "Full tuition fees + ₹1,200/month maintenance allowance",
      eligibility: "ST category students, family income below ₹2.5 LPA",
      deadline: "31st October",
      applicationLink: "https://scholarships.gov.in",
      streams: ["Engineering", "Medical", "Management", "Law", "Arts", "Science", "Commerce"],
      categories: ["ST"],
    },
    {
      name: "Post-Matric Scholarship for OBC Students",
      provider: "Ministry of Social Justice & Empowerment",
      description: "Scholarship for OBC students to pursue post-matriculation education in recognized institutions across India.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.NATIONAL,
      amount: "Tuition fee reimbursement + ₹750/month maintenance",
      eligibility: "OBC category students, family income below ₹1.5 LPA",
      deadline: "30th November",
      applicationLink: "https://scholarships.gov.in",
      streams: ["Engineering", "Medical", "Management", "Law", "Arts", "Science", "Commerce"],
      categories: ["OBC"],
    },
    {
      name: "National Means-cum-Merit Scholarship (NMMSS)",
      provider: "Ministry of Education, Government of India",
      description: "Scholarship to meritorious students from economically weaker sections to arrest their dropout rate at Class 8 and encourage them to continue education at secondary and higher secondary level.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.NATIONAL,
      amount: "₹12,000/year",
      eligibility: "Scored above 55% in Class 7, studying in government schools, family income below ₹3.5 LPA",
      deadline: "30th November",
      applicationLink: "https://scholarships.gov.in",
      streams: ["Arts", "Science", "Commerce"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Begum Hazrat Mahal National Scholarship",
      provider: "Maulana Azad Education Foundation",
      description: "Scholarship for meritorious girl students belonging to minority communities to encourage them to pursue higher education.",
      type: ScholarshipType.MINORITY,
      level: ScholarshipLevel.NATIONAL,
      amount: "₹10,000 (Class 9-10), ₹12,000 (Class 11-12)",
      eligibility: "Minority community girl students, scored above 50% in previous exam, family income below ₹2 LPA",
      deadline: "30th September",
      applicationLink: "https://scholarships.gov.in",
      streams: ["Arts", "Science", "Commerce"],
      categories: ["General"],
    },
    {
      name: "Prime Minister's Scholarship Scheme (PMSS)",
      provider: "Ministry of Defence, Government of India",
      description: "Scholarship for wards of ex-servicemen and widows of defence personnel for pursuing professional degree courses in engineering, medical, dental, MBA, etc.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.NATIONAL,
      amount: "₹3,000/month (boys), ₹3,600/month (girls)",
      eligibility: "Wards/widows of ex-servicemen, scored above 60% in Class 12",
      deadline: "31st October",
      applicationLink: "https://ksb.gov.in",
      streams: ["Engineering", "Medical", "Management"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "AICTE Saksham Scholarship for Differently Abled",
      provider: "All India Council for Technical Education",
      description: "Financial assistance to differently-abled students pursuing technical education in AICTE-approved institutions to ensure inclusive education.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.NATIONAL,
      amount: "₹50,000/year",
      eligibility: "Differently-abled students (40%+ disability) in AICTE-approved institutions, family income below ₹8 LPA",
      deadline: "31st December",
      applicationLink: "https://www.aicte-india.org/schemes/students-development-schemes/Saksham",
      streams: ["Engineering", "Architecture", "Pharmacy"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Kishore Vaigyanik Protsahan Yojana (KVPY)",
      provider: "Department of Science & Technology",
      description: "Fellowship program to encourage students with aptitude for basic science research. Provides generous monthly fellowship and annual contingency grant.",
      type: ScholarshipType.RESEARCH,
      level: ScholarshipLevel.NATIONAL,
      amount: "₹5,000-7,000/month fellowship + ₹20,000-28,000/year contingency",
      eligibility: "Students enrolled in B.Sc./B.S./B.Math/B.Stat programs, must clear KVPY aptitude test",
      deadline: "31st August",
      applicationLink: "https://kvpy.iisc.ac.in",
      streams: ["Science"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "UGC National Fellowship for OBC",
      provider: "University Grants Commission",
      description: "Fellowship for OBC candidates pursuing M.Phil/Ph.D in universities, colleges, and institutions recognized by UGC.",
      type: ScholarshipType.RESEARCH,
      level: ScholarshipLevel.NATIONAL,
      amount: "₹31,000/month (JRF), ₹35,000/month (SRF)",
      eligibility: "OBC candidates who have qualified UGC-NET JRF, pursuing Ph.D",
      deadline: "Rolling",
      applicationLink: "https://ugc.gov.in",
      streams: ["Science", "Arts", "Commerce", "Engineering"],
      categories: ["OBC"],
    },
    {
      name: "Sports Scholarship by Ministry of Youth Affairs",
      provider: "Ministry of Youth Affairs & Sports",
      description: "Scholarship for outstanding sportspersons who have represented state or national level and are pursuing higher education.",
      type: ScholarshipType.SPORTS,
      level: ScholarshipLevel.NATIONAL,
      amount: "₹25,000-50,000/year depending on level of achievement",
      eligibility: "Represented at state/national level in recognized sports, admitted to any recognized institution",
      deadline: "31st December",
      applicationLink: "https://yas.nic.in",
      streams: ["Engineering", "Medical", "Management", "Arts", "Science", "Commerce"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    // ── State Government Scholarships ──
    {
      name: "Maharashtra State Scholarship (Rajarshi Chhatrapati Shahu Maharaj)",
      provider: "Government of Maharashtra",
      description: "Tuition fee and exam fee scholarship for students from Maharashtra belonging to economically backward classes pursuing professional courses.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.STATE,
      amount: "Full tuition fee reimbursement",
      eligibility: "Domicile of Maharashtra, family income below ₹8 LPA, admitted to government/aided institutions",
      deadline: "15th December",
      applicationLink: "https://mahadbt.maharashtra.gov.in",
      streams: ["Engineering", "Medical", "Pharmacy", "Management"],
      categories: ["OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Karnataka State Higher Education Scholarship",
      provider: "Government of Karnataka",
      description: "Fee concession and maintenance allowance for Karnataka domicile students from backward classes pursuing higher education.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.STATE,
      amount: "Full tuition fee + ₹1,500/month maintenance",
      eligibility: "Karnataka domicile, family income below ₹2 LPA",
      deadline: "30th November",
      applicationLink: "https://sw.kar.nic.in",
      streams: ["Engineering", "Medical", "Arts", "Science", "Commerce"],
      categories: ["SC", "ST", "OBC"],
    },
    {
      name: "Tamil Nadu BC/MBC Scholarship",
      provider: "Government of Tamil Nadu",
      description: "Scholarship for backward class and most backward class students of Tamil Nadu pursuing professional and non-professional courses.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.STATE,
      amount: "Full tuition fee + ₹1,000/month stipend",
      eligibility: "Tamil Nadu domicile, BC/MBC category, family income below ₹2 LPA",
      deadline: "31st October",
      applicationLink: "https://www.tn.gov.in/scholarships",
      streams: ["Engineering", "Medical", "Arts", "Science"],
      categories: ["OBC"],
    },
    {
      name: "Uttar Pradesh Scholarship (Pre & Post Matric)",
      provider: "Government of Uttar Pradesh",
      description: "Comprehensive scholarship scheme for students of UP from minority and backward communities for pre-matric and post-matric education.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.STATE,
      amount: "Tuition fee reimbursement + maintenance allowance",
      eligibility: "UP domicile, family income below ₹2 LPA",
      deadline: "30th November",
      applicationLink: "https://scholarship.up.gov.in",
      streams: ["Engineering", "Medical", "Arts", "Science", "Commerce", "Law"],
      categories: ["OBC", "SC", "ST", "General"],
    },
    {
      name: "West Bengal Swami Vivekananda Merit-cum-Means Scholarship",
      provider: "Government of West Bengal",
      description: "Merit-cum-means scholarship for students of West Bengal pursuing higher education in institutions within the state.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.STATE,
      amount: "₹5,000-8,000/month depending on course",
      eligibility: "West Bengal domicile, scored above 75% in qualifying exam, family income below ₹2.5 LPA",
      deadline: "31st December",
      applicationLink: "https://svmcm.wbhed.gov.in",
      streams: ["Engineering", "Medical", "Science", "Arts", "Commerce"],
      categories: ["General", "OBC", "SC", "ST"],
    },
    {
      name: "Telangana TS ePASS Scholarship",
      provider: "Government of Telangana",
      description: "Electronic Payment and Application System of Scholarships for BC, SC, ST, and EBC students of Telangana pursuing post-matric education.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.STATE,
      amount: "Full tuition fee + ₹1,000/month maintenance",
      eligibility: "Telangana domicile, family income below ₹2 LPA",
      deadline: "30th November",
      applicationLink: "https://telanganaepass.cgg.gov.in",
      streams: ["Engineering", "Medical", "Arts", "Science", "Commerce"],
      categories: ["OBC", "SC", "ST", "EWS"],
    },
    // ── Institutional Scholarships ──
    {
      name: "IIT Fee Waiver Scheme",
      provider: "Indian Institutes of Technology",
      description: "Complete fee waiver for students from economically weaker sections admitted to any IIT through JEE Advanced. Partial fee waivers also available based on income slabs.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.INSTITUTIONAL,
      amount: "Full tuition waiver (income < ₹1 LPA), 2/3 waiver (₹1-5 LPA)",
      eligibility: "Students admitted to IITs through JEE Advanced, family income below ₹5 LPA",
      deadline: "At the time of admission",
      applicationLink: "https://josaa.nic.in",
      streams: ["Engineering", "Science"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "BITS Pilani Merit Scholarship",
      provider: "Birla Institute of Technology and Science, Pilani",
      description: "Merit-based scholarship for top performers in BITSAT exam. Covers partial to full tuition based on BITSAT score and academic performance.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.INSTITUTIONAL,
      amount: "Up to 80% tuition fee waiver",
      eligibility: "Top scorers in BITSAT, maintained CGPA above 7.5",
      deadline: "At the time of admission",
      applicationLink: "https://www.bitsadmission.com",
      streams: ["Engineering", "Science"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "VIT Merit Scholarship",
      provider: "Vellore Institute of Technology",
      description: "Performance-based scholarship for students admitted through VITEEE with exceptional scores. Ranges from 50% to 100% tuition waiver.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.INSTITUTIONAL,
      amount: "50% to 100% tuition fee waiver",
      eligibility: "Top 50 rank holders in VITEEE exam",
      deadline: "At the time of admission",
      applicationLink: "https://vit.ac.in",
      streams: ["Engineering"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "SRM University Merit Scholarship",
      provider: "SRM Institute of Science and Technology",
      description: "Academic excellence scholarship for top rankers in SRMJEE with significant tuition fee waivers across all campuses.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.INSTITUTIONAL,
      amount: "25% to 100% tuition fee waiver",
      eligibility: "Top rankers in SRMJEE, maintain minimum CGPA each semester",
      deadline: "At the time of admission",
      applicationLink: "https://www.srmist.edu.in",
      streams: ["Engineering", "Science", "Management"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Manipal University Scholarship",
      provider: "Manipal Academy of Higher Education",
      description: "Need-cum-merit scholarship for students admitted to MAHE institutions. Supports students demonstrating financial need alongside academic capability.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.INSTITUTIONAL,
      amount: "₹1,00,000 to ₹2,50,000/year",
      eligibility: "Admitted to MAHE programs, family income below ₹6 LPA, good academic record",
      deadline: "30th September",
      applicationLink: "https://manipal.edu",
      streams: ["Engineering", "Medical", "Management", "Science"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "NIT Merit-cum-Means Scholarship",
      provider: "National Institutes of Technology",
      description: "Merit-cum-means based fee waiver for students admitted to NITs. Full and partial free-ship available based on family income.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.INSTITUTIONAL,
      amount: "Full tuition waiver (income < ₹1 LPA), partial waiver (₹1-5 LPA)",
      eligibility: "Admitted to NITs through JEE Main, family income below ₹5 LPA",
      deadline: "At the time of admission",
      applicationLink: "https://josaa.nic.in",
      streams: ["Engineering", "Science", "Architecture"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    // ── Private / Foundation Scholarships ──
    {
      name: "Tata Trust Scholarship",
      provider: "Tata Trusts",
      description: "One of India's oldest and most prestigious private scholarships supporting students from underprivileged backgrounds in professional education. Covers tuition and living expenses.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.PRIVATE,
      amount: "Up to ₹6,00,000/year (tuition + living expenses)",
      eligibility: "Admitted to select premier institutions, family income below ₹4 LPA, demonstrated financial need",
      deadline: "15th March",
      applicationLink: "https://www.tatatrusts.org",
      streams: ["Engineering", "Medical", "Management", "Law", "Science"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Reliance Foundation Scholarship",
      provider: "Reliance Foundation",
      description: "Scholarship for meritorious undergraduate students across India in STEM, humanities, and business disciplines. Provides financial support and mentorship.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.PRIVATE,
      amount: "Up to ₹4,00,000/year",
      eligibility: "Indian nationals, admitted to accredited UG programs, scored above 60% in Class 12",
      deadline: "28th February",
      applicationLink: "https://www.reliancefoundation.org/scholarships",
      streams: ["Engineering", "Science", "Arts", "Commerce", "Management"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Narotam Sekhsaria Foundation Scholarship",
      provider: "Narotam Sekhsaria Foundation",
      description: "Interest-free loan scholarship for students pursuing postgraduate studies in India and abroad. One of the most well-known PG support scholarships.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.PRIVATE,
      amount: "Up to ₹20,00,000 (interest-free loan)",
      eligibility: "Indian nationals pursuing PG in premier institutions (IIMs, IITs, ISB, etc.)",
      deadline: "15th April",
      applicationLink: "https://nsfoundation.co.in",
      streams: ["Engineering", "Management", "Science", "Law"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Azim Premji Foundation Scholarship",
      provider: "Azim Premji Foundation",
      description: "Scholarship for students pursuing education and development sector courses, focusing on building leaders for social change.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.PRIVATE,
      amount: "Full tuition + ₹5,000/month living allowance",
      eligibility: "Admitted to Azim Premji University programs, demonstrated commitment to social sector",
      deadline: "30th June",
      applicationLink: "https://azimpremjifoundation.org",
      streams: ["Arts", "Science", "Management"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Kotak Kanya Scholarship",
      provider: "Kotak Mahindra Group",
      description: "Scholarship exclusively for meritorious girl students from underprivileged families pursuing professional graduation courses.",
      type: ScholarshipType.MERIT,
      level: ScholarshipLevel.PRIVATE,
      amount: "Up to ₹1,50,000/year (for entire course duration)",
      eligibility: "Girl students, scored above 85% in Class 12, family income below ₹3.2 LPA",
      deadline: "31st December",
      applicationLink: "https://www.kotak.com/en/CSR.html",
      streams: ["Engineering", "Medical", "Science", "Management", "Law"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Sitaram Jindal Foundation Scholarship",
      provider: "Sitaram Jindal Foundation",
      description: "Financial assistance for economically weaker students pursuing professional courses in engineering, medical, and management.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.PRIVATE,
      amount: "₹15,000-45,000/year",
      eligibility: "Family income below ₹2 LPA, pursuing recognized professional courses",
      deadline: "Rolling",
      applicationLink: "https://www.sitaramjindalfoundation.org",
      streams: ["Engineering", "Medical", "Management"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "L&T Build India Scholarship",
      provider: "Larsen & Toubro",
      description: "Scholarship for economically disadvantaged students admitted to top engineering institutions pursuing B.Tech/BE in select disciplines.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.PRIVATE,
      amount: "Up to ₹2,00,000/year",
      eligibility: "Admitted to IITs/NITs/IIITs, pursuing engineering in infrastructure-related disciplines, family income below ₹4 LPA",
      deadline: "31st October",
      applicationLink: "https://www.lntecc.com",
      streams: ["Engineering"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
    {
      name: "Foundation For Excellence (FFE) Scholarship",
      provider: "Foundation For Excellence India Trust",
      description: "Full scholarship covering tuition and living expenses for first-generation engineering students from underprivileged families studying in select colleges.",
      type: ScholarshipType.NEED_BASED,
      level: ScholarshipLevel.PRIVATE,
      amount: "Full tuition + ₹60,000/year living expenses",
      eligibility: "First-generation graduates, family income below ₹3 LPA, admitted to partner engineering colleges",
      deadline: "15th September",
      applicationLink: "https://ffe.org",
      streams: ["Engineering"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
    },
  ];

  let scholarshipCount = 0;
  for (const s of scholarships) {
    await prisma.scholarship.upsert({
      where: { slug: slug(s.name) },
      update: {},
      create: {
        name: s.name,
        slug: slug(s.name),
        provider: s.provider,
        description: s.description,
        type: s.type,
        level: s.level,
        amount: s.amount,
        eligibility: s.eligibility,
        deadline: s.deadline,
        applicationLink: s.applicationLink,
        streams: s.streams,
        categories: s.categories,
      },
    });
    scholarshipCount++;
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   ${collegeCount} colleges`);
  console.log(`   ${courseCount} courses`);
  console.log(`   ${cutoffCount} cutoff entries`);
  console.log(`   ${reviewCount} reviews`);
  console.log(`   ${scholarshipCount} scholarships`);
  console.log(`   1 demo user (demo@collegecompass.in / demo1234)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
