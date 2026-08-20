import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { predictorSchema } from "@/lib/validations";
import { PredictionResult, PredictionFactor } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = predictorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid predictor inputs",
          details: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const { exam, rank, category, course, state, maxFees } = parsed.data;

    // Fetch colleges that offer relevant cutoffs or courses
    const colleges = await prisma.college.findMany({
      include: {
        cutoffs: {
          where: {
            exam: { equals: exam, mode: "insensitive" },
            category: { equals: category, mode: "insensitive" },
          },
        },
        courses: true,
      },
    });

    const results: PredictionResult[] = [];

    for (const college of colleges) {
      const factors: PredictionFactor[] = [];
      let totalWeightedScore = 0;

      // ─── 1. Rank Compatibility (Weight: 40%) ───────────────
      const relevantCutoff = college.cutoffs.find(
        (c) =>
          c.course.toLowerCase().includes(course.toLowerCase()) ||
          course.toLowerCase().includes(c.course.toLowerCase())
      ) || college.cutoffs[0];

      let rankScore = 0;
      let rankDetail = "";

      if (relevantCutoff) {
        const closing = relevantCutoff.closingRank;
        if (rank <= closing) {
          // Strong match
          rankScore = 1.0;
          rankDetail = `Your rank (${rank.toLocaleString()}) is comfortably within the closing cutoff (${closing.toLocaleString()}) for ${category} category.`;
        } else if (rank <= closing * 1.2) {
          // Moderate match (within 20% reach)
          rankScore = 0.75;
          rankDetail = `Your rank (${rank.toLocaleString()}) is close to the cutoff (${closing.toLocaleString()}). Good chance in subsequent admission rounds.`;
        } else if (rank <= closing * 1.5) {
          // Long shot (within 50% reach)
          rankScore = 0.4;
          rankDetail = `Your rank (${rank.toLocaleString()}) exceeds the general cutoff (${closing.toLocaleString()}). May be possible via spot rounds.`;
        } else {
          rankScore = 0.1;
          rankDetail = `Your rank (${rank.toLocaleString()}) is significantly higher than previous closing cutoffs (${closing.toLocaleString()}).`;
        }
      } else {
        // If college doesn't have explicit cutoffs for this exam, check college tier rank compatibility
        rankScore = college.type === "GOVERNMENT" ? 0.3 : 0.6;
        rankDetail = `Standard admission process applies through ${exam} counseling.`;
      }

      factors.push({
        name: "Rank Compatibility",
        matched: rankScore >= 0.7,
        detail: rankDetail,
        weight: 40,
        score: Math.round(rankScore * 40),
      });
      totalWeightedScore += rankScore * 40;

      // ─── 2. Course Availability (Weight: 25%) ──────────────
      const matchingCourse = college.courses.find(
        (c) =>
          c.name.toLowerCase().includes(course.toLowerCase()) ||
          c.slug.toLowerCase().includes(course.toLowerCase()) ||
          course.toLowerCase().includes(c.name.toLowerCase())
      );

      let courseScore = 0;
      let courseDetail = "";

      if (matchingCourse) {
        courseScore = 1.0;
        courseDetail = `Offers ${matchingCourse.name} (${matchingCourse.duration}).`;
      } else {
        const matchingStream = college.courses.some(
          (c) =>
            c.stream.toLowerCase().includes(course.toLowerCase()) ||
            course.toLowerCase().includes(c.stream.toLowerCase())
        );
        if (matchingStream) {
          courseScore = 0.7;
          courseDetail = `Related discipline programs available in the same department.`;
        } else {
          courseScore = 0.2;
          courseDetail = `Exact program "${course}" not listed in current curriculum.`;
        }
      }

      factors.push({
        name: "Course Availability",
        matched: courseScore >= 0.7,
        detail: courseDetail,
        weight: 25,
        score: Math.round(courseScore * 25),
      });
      totalWeightedScore += courseScore * 25;

      // ─── 3. Location Preference (Weight: 15%) ──────────────
      let locScore = 0.5;
      let locDetail = `Located in ${college.city}, ${college.state}.`;

      if (state && state.trim() !== "") {
        if (college.state.toLowerCase() === state.toLowerCase()) {
          locScore = 1.0;
          locDetail = `Located in your preferred state (${college.state}, ${college.city}).`;
        } else {
          locScore = 0.3;
          locDetail = `Located in ${college.state} (outside your preferred state ${state}).`;
        }
      }

      factors.push({
        name: "Location Match",
        matched: locScore >= 0.7,
        detail: locDetail,
        weight: 15,
        score: Math.round(locScore * 15),
      });
      totalWeightedScore += locScore * 15;

      // ─── 4. Fee Compatibility (Weight: 10%) ────────────────
      let feeScore = 0.7;
      let feeDetail = `Annual fees: ₹${(college.feesMin / 100000).toFixed(1)}L - ₹${(college.feesMax / 100000).toFixed(1)}L.`;

      if (maxFees && maxFees > 0) {
        if (college.feesMax <= maxFees) {
          feeScore = 1.0;
          feeDetail = `Full program within your budget of ₹${(maxFees / 100000).toFixed(1)}L/yr.`;
        } else if (college.feesMin <= maxFees) {
          feeScore = 0.8;
          feeDetail = `Base fee within budget; select specializations may exceed slightly.`;
        } else {
          feeScore = 0.3;
          feeDetail = `Fees exceed your preferred budget limit of ₹${(maxFees / 100000).toFixed(1)}L/yr.`;
        }
      }

      factors.push({
        name: "Fee Compatibility",
        matched: feeScore >= 0.7,
        detail: feeDetail,
        weight: 10,
        score: Math.round(feeScore * 10),
      });
      totalWeightedScore += feeScore * 10;

      // ─── 5. College Rating & Quality (Weight: 10%) ─────────
      const ratingScore = Math.min(1.0, college.rating / 5.0);
      factors.push({
        name: "Institution Rating",
        matched: college.rating >= 4.0,
        detail: `${college.rating.toFixed(1)}/5.0 student rating with strong placement track record.`,
        weight: 10,
        score: Math.round(ratingScore * 10),
      });
      totalWeightedScore += ratingScore * 10;

      const finalMatchScore = Math.min(99, Math.max(20, Math.round(totalWeightedScore)));

      // Only include colleges with at least moderate match
      if (finalMatchScore >= 35) {
        results.push({
          college: {
            id: college.id,
            name: college.name,
            slug: college.slug,
            city: college.city,
            state: college.state,
            type: college.type,
            rating: college.rating,
            reviewCount: college.reviewCount,
            feesMin: college.feesMin,
            feesMax: college.feesMax,
            avgPackage: college.avgPackage,
            highestPackage: college.highestPackage,
            placementRate: college.placementRate,
            logoUrl: college.logoUrl,
            streams: Array.from(new Set(college.courses.map((c) => c.stream))),
          },
          matchScore: finalMatchScore,
          factors,
        });
      }
    }

    // Sort by Match Score descending
    results.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      data: results.slice(0, 15), // Return top 15 recommendations
    });
  } catch (error) {
    console.error("POST /api/predict error:", error);
    return NextResponse.json(
      { error: "Internal server error during college prediction" },
      { status: 500 }
    );
  }
}
