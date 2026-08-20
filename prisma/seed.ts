import { PrismaClient, CollegeType } from "@prisma/client";
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

  for (const template of COLLEGE_TEMPLATES) {
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

    // Create courses
    const courses = getCoursesForStreams(template.streams, (feesMin + feesMax) / 2);
    for (const course of courses) {
      await prisma.course.create({
        data: {
          ...course,
          collegeId: college.id,
        },
      });
      courseCount++;
    }

    // Create cutoff data (only for engineering)
    if (template.streams.includes("Engineering")) {
      const cutoffs = getCutoffData(template.name, template.state, template.tier, courses);
      for (const cutoff of cutoffs) {
        await prisma.cutoffData.create({
          data: {
            ...cutoff,
            collegeId: college.id,
          },
        });
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

    collegeCount++;
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   ${collegeCount} colleges`);
  console.log(`   ${courseCount} courses`);
  console.log(`   ${cutoffCount} cutoff entries`);
  console.log(`   ${reviewCount} reviews`);
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
