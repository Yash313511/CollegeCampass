import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [states, streams, stats] = await Promise.all([
      prisma.college.findMany({
        select: { state: true },
        distinct: ["state"],
        orderBy: { state: "asc" },
      }),
      prisma.course.findMany({
        select: { stream: true },
        distinct: ["stream"],
        orderBy: { stream: "asc" },
      }),
      prisma.college.aggregate({
        _min: { feesMin: true },
        _max: { feesMax: true },
      }),
    ]);

    return NextResponse.json({
      data: {
        states: states.map((s) => s.state),
        streams: streams.map((st) => st.stream),
        types: ["GOVERNMENT", "PRIVATE", "DEEMED", "AUTONOMOUS"],
        minFees: stats._min.feesMin ?? 50000,
        maxFees: stats._max.feesMax ?? 1000000,
      },
    });
  } catch (error) {
    console.error("GET /api/colleges/filters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}
