import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { savedCollegeSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to view saved colleges" },
        { status: 401 }
      );
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: {
        college: {
          include: {
            courses: {
              select: { stream: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = saved.map((s) => ({
      id: s.id,
      collegeId: s.collegeId,
      createdAt: s.createdAt.toISOString(),
      college: {
        id: s.college.id,
        name: s.college.name,
        slug: s.college.slug,
        city: s.college.city,
        state: s.college.state,
        type: s.college.type,
        rating: s.college.rating,
        reviewCount: s.college.reviewCount,
        feesMin: s.college.feesMin,
        feesMax: s.college.feesMax,
        avgPackage: s.college.avgPackage,
        highestPackage: s.college.highestPackage,
        placementRate: s.college.placementRate,
        logoUrl: s.college.logoUrl,
        streams: Array.from(new Set(s.college.courses.map((cr) => cr.stream))),
      },
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/saved-colleges error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved colleges" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to save colleges" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = savedCollegeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid college ID", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { collegeId } = parsed.data;

    // Check college existence
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Upsert or create
    const saved = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: college.id,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        collegeId: college.id,
      },
    });

    return NextResponse.json({ data: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/saved-colleges error:", error);
    return NextResponse.json(
      { error: "Failed to save college" },
      { status: 500 }
    );
  }
}
