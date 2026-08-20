import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find college first
    const college = await prisma.college.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const courses = await prisma.course.findMany({
      where: { collegeId: college.id },
      orderBy: { stream: "asc" },
    });

    return NextResponse.json({ data: courses });
  } catch (error) {
    console.error("GET /api/colleges/[id]/courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
