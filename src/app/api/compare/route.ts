import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compareSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { error: "Query parameter 'ids' is required (2 to 3 comma-separated college IDs or slugs)" },
        { status: 400 }
      );
    }

    const parsed = compareSchema.safeParse({ ids: idsParam });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid comparison request. Must provide 2 or 3 college IDs or slugs.",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const ids = parsed.data.ids;

    const colleges = await prisma.college.findMany({
      where: {
        OR: [{ id: { in: ids } }, { slug: { in: ids } }],
      },
      include: {
        courses: {
          select: {
            name: true,
            stream: true,
            fees: true,
            duration: true,
          },
        },
      },
    });

    if (colleges.length < 2) {
      return NextResponse.json(
        { error: "At least 2 valid colleges are required for comparison" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: colleges,
    });
  } catch (error) {
    console.error("GET /api/compare error:", error);
    return NextResponse.json(
      { error: "Internal server error during comparison" },
      { status: 500 }
    );
  }
}
