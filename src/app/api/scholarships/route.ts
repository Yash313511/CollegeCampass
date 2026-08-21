import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, ScholarshipType, ScholarshipLevel } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const type = url.searchParams.get("type") || "";
    const level = url.searchParams.get("level") || "";
    const stream = url.searchParams.get("stream") || "";
    const category = url.searchParams.get("category") || "";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "12")));

    const where: Prisma.ScholarshipWhereInput = {};

    // Full-text search on name, provider, description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { provider: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Type filter
    if (type && Object.values(ScholarshipType).includes(type as ScholarshipType)) {
      where.type = type as ScholarshipType;
    }

    // Level filter
    if (level && Object.values(ScholarshipLevel).includes(level as ScholarshipLevel)) {
      where.level = level as ScholarshipLevel;
    }

    // Stream filter (array contains)
    if (stream) {
      where.streams = { has: stream };
    }

    // Category filter (array contains)
    if (category) {
      where.categories = { has: category };
    }

    const [scholarships, total] = await Promise.all([
      prisma.scholarship.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.scholarship.count({ where }),
    ]);

    return NextResponse.json({
      data: scholarships,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Scholarships API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scholarships" },
      { status: 500 }
    );
  }
}
