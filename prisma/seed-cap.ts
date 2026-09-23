import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";
import { PUNE_CAP_COLLEGES } from "../src/lib/cap-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedCapColleges() {
  console.log("🚀 Starting Pune CAP Region Colleges Database Seeding...");

  console.log("🗑️ Deleting all previous CAP colleges, courses, and cutoffs...");
  await prisma.capCutoff.deleteMany({});
  await prisma.capCourse.deleteMany({});
  await prisma.capCollege.deleteMany({});
  console.log("✨ All previous CAP colleges cleanly deleted!");

  let collegeCount = 0;
  let courseCount = 0;
  let cutoffCount = 0;

  for (const col of PUNE_CAP_COLLEGES) {
    // Create College directly (table was wiped)
    const savedCollege = await prisma.capCollege.create({
      data: {
        collegeCode: col.collegeCode,
        name: col.name,
        slug: col.slug,
        status: col.status,
        region: col.region,
        district: col.district,
        university: col.university,
        address: col.address,
        establishedYear: col.establishedYear,
        website: col.website,
        feesAnnual: col.feesAnnual,
        avgPackage: col.avgPackage,
        highestPackage: col.highestPackage,
        rating: col.rating,
        accreditation: col.accreditation,
      },
    });

    collegeCount++;
    console.log(`  [${savedCollege.collegeCode}] ${savedCollege.name}`);

    // Insert Courses and Cutoffs
    for (const course of col.courses) {
      const savedCourse = await prisma.capCourse.create({
        data: {
          choiceCode: course.choiceCode,
          courseName: course.courseName,
          stream: course.stream,
          intake: course.intake,
          shift: course.shift,
          status: course.status,
          capCollegeId: savedCollege.id,
        },
      });

      courseCount++;

      if (course.cutoffs && course.cutoffs.length > 0) {
        const cutoffData = course.cutoffs.map((cut) => ({
          category: cut.category,
          homeUniversityPercentile: cut.homeUniversityPercentile,
          otherThanHomeUniversityPercentile: cut.otherThanHomeUniversityPercentile,
          stateLevelPercentile: cut.stateLevelPercentile,
          round: cut.round,
          year: cut.year,
          capCourseId: savedCourse.id,
        }));
        await prisma.capCutoff.createMany({ data: cutoffData });
        cutoffCount += cutoffData.length;
      }
    }
  }

  console.log(`\n✅ Pune CAP Database Seeding Complete!`);
  console.log(`📊 Summary:`);
  console.log(`  • Colleges Seeded: ${collegeCount}`);
  console.log(`  • Branch Choice Codes: ${courseCount}`);
  console.log(`  • Caste Cutoff Data Points: ${cutoffCount}`);

  await pool.end();
}

seedCapColleges().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
