import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collegeSearchSchema } from "@/lib/validations";
import { Prisma, CollegeType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = collegeSearchSchema.safeParse(searchParams);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const {
      search,
      state,
      city,
      stream,
      type,
      minFees,
      maxFees,
      minRating,
      sort,
      page,
      limit,
    } = parsed.data;

    // Build WHERE clause
    const where: Prisma.CollegeWhereInput = {};

    if (search && search.trim() !== "") {
      const term = search.trim();
      where.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { city: { contains: term, mode: "insensitive" } },
        { state: { contains: term, mode: "insensitive" } },
        {
          courses: {
            some: {
              name: { contains: term, mode: "insensitive" },
            },
          },
        },
      ];
    }

    if (state) {
      where.state = { equals: state, mode: "insensitive" };
    }

    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }

    if (type) {
      where.type = type as CollegeType;
    }

    if (minRating !== undefined && minRating > 0) {
      where.rating = { gte: minRating };
    }

    if (minFees !== undefined || maxFees !== undefined) {
      where.AND = [
        ...(minFees !== undefined ? [{ feesMax: { gte: minFees } }] : []),
        ...(maxFees !== undefined ? [{ feesMin: { lte: maxFees } }] : []),
      ];
    }

    if (stream) {
      where.courses = {
        some: {
          stream: { equals: stream, mode: "insensitive" },
        },
      };
    }

    // Build ORDER BY clause
    let orderBy: Prisma.CollegeOrderByWithRelationInput = { rating: "desc" };

    switch (sort) {
      case "fees_asc":
        orderBy = { feesMin: "asc" };
        break;
      case "fees_desc":
        orderBy = { feesMax: "desc" };
        break;
      case "placement_desc":
        orderBy = { avgPackage: "desc" };
        break;
      case "name_asc":
        orderBy = { name: "asc" };
        break;
      case "rating_desc":
      default:
        orderBy = { rating: "desc" };
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Parallel query for count and paginated items
    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          state: true,
          type: true,
          rating: true,
          reviewCount: true,
          feesMin: true,
          feesMax: true,
          avgPackage: true,
          highestPackage: true,
          placementRate: true,
          logoUrl: true,
          courses: {
            select: {
              stream: true,
            },
          },
        },
      }),
    ]);

    // Format list items
    const data = colleges.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      city: c.city,
      state: c.state,
      type: c.type,
      rating: c.rating,
      reviewCount: c.reviewCount,
      feesMin: c.feesMin,
      feesMax: c.feesMax,
      avgPackage: c.avgPackage,
      highestPackage: c.highestPackage,
      placementRate: c.placementRate,
      logoUrl: c.logoUrl,
      streams: Array.from(new Set(c.courses.map((cr) => cr.stream))),
    }));

    return NextResponse.json({
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/colleges error:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching colleges" },
      { status: 500 }
    );
  }
}
