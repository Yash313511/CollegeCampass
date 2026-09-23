import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PUNE_CAP_COLLEGES, calculateCapChance, getApplicableCutoff } from "@/lib/cap-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const percentile = params.get("percentile") ? parseFloat(params.get("percentile")!) : undefined;
    const category = params.get("category") || "GOPEN";
    const quota = (params.get("quota") as "HU" | "OHU" | "AI") || "HU";
    const search = params.get("search") || "";
    const stream = params.get("stream") || "";
    const collegeType = params.get("type") || "";
    const maxFees = params.get("maxFees") ? parseInt(params.get("maxFees")!) : undefined;
    const sort = params.get("sort") || "cutoff_desc";

    // Try to get from DB first
    let dbColleges: typeof PUNE_CAP_COLLEGES = [];
    try {
      const colleges = await prisma.capCollege.findMany({
        include: {
          courses: {
            include: { cutoffs: true },
          },
        },
        orderBy: { rating: "desc" },
      });

      if (colleges.length > 0) {
        // Map DB records to our type
        dbColleges = colleges.map((c) => ({
          id: c.id,
          collegeCode: c.collegeCode,
          name: c.name,
          slug: c.slug,
          status: c.status,
          region: c.region,
          district: c.district,
          university: c.university,
          address: c.address,
          establishedYear: c.establishedYear,
          website: c.website,
          feesAnnual: c.feesAnnual,
          avgPackage: c.avgPackage,
          highestPackage: c.highestPackage,
          rating: c.rating,
          accreditation: c.accreditation,
          imageUrl: c.imageUrl,
          courses: c.courses.map((course) => ({
            id: course.id,
            choiceCode: course.choiceCode,
            courseName: course.courseName,
            stream: course.stream,
            intake: course.intake,
            shift: course.shift,
            status: course.status,
            capCollegeId: course.capCollegeId,
            cutoffs: course.cutoffs.map((cut) => ({
              id: cut.id,
              category: cut.category,
              homeUniversityPercentile: cut.homeUniversityPercentile,
              otherThanHomeUniversityPercentile: cut.otherThanHomeUniversityPercentile,
              stateLevelPercentile: cut.stateLevelPercentile,
              round: cut.round,
              year: cut.year,
            })),
          })),
        }));
      }
    } catch {
      // Fallback to static data if DB not available
    }

    const sourceData = dbColleges.length > 0 ? dbColleges : PUNE_CAP_COLLEGES;

    // Filter and enrich
    let results = sourceData
      .map((college) => {
        // Apply college-level filters
        if (search && !college.name.toLowerCase().includes(search.toLowerCase()) &&
          !college.collegeCode.includes(search)) {
          return null;
        }
        if (collegeType && !college.status.toLowerCase().includes(collegeType.toLowerCase())) {
          return null;
        }
        if (maxFees && college.feesAnnual > maxFees) {
          return null;
        }

        // Filter and score courses
        const enrichedCourses = college.courses
          .filter((course) => {
            if (stream && !course.courseName.toLowerCase().includes(stream.toLowerCase()) &&
              !course.stream.toLowerCase().includes(stream.toLowerCase())) {
              return false;
            }
            return true;
          })
          .map((course) => {
            const cutoff = getApplicableCutoff(course.cutoffs, category, quota);
            const chance = percentile != null && cutoff != null
              ? calculateCapChance(percentile, cutoff)
              : "Target";

            return {
              ...course,
              applicableCutoff: cutoff,
              chance,
            };
          });

        if (enrichedCourses.length === 0) return null;

        return { ...college, courses: enrichedCourses };
      })
      .filter(Boolean) as typeof sourceData;

    // Sort
    if (sort === "cutoff_desc") {
      results.sort((a, b) => {
        const maxA = Math.max(...a.courses.map((c) => (c as { applicableCutoff?: number | null }).applicableCutoff || 0));
        const maxB = Math.max(...b.courses.map((c) => (c as { applicableCutoff?: number | null }).applicableCutoff || 0));
        return maxB - maxA;
      });
    } else if (sort === "cutoff_asc") {
      results.sort((a, b) => {
        const minA = Math.min(...a.courses.map((c) => (c as { applicableCutoff?: number | null }).applicableCutoff || 100));
        const minB = Math.min(...b.courses.map((c) => (c as { applicableCutoff?: number | null }).applicableCutoff || 100));
        return minA - minB;
      });
    } else if (sort === "rating_desc") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sort === "fees_asc") {
      results.sort((a, b) => a.feesAnnual - b.feesAnnual);
    } else if (sort === "package_desc") {
      results.sort((a, b) => (b.avgPackage || 0) - (a.avgPackage || 0));
    }

    return NextResponse.json({ data: results, total: results.length });
  } catch (error) {
    console.error("GET /api/cap-colleges error:", error);
    return NextResponse.json({ error: "Failed to fetch CAP colleges" }, { status: 500 });
  }
}
