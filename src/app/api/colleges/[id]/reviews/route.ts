import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const college = await prisma.college.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: { collegeId: college.id },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: reviews });
  } catch (error) {
    console.error("GET /api/colleges/[id]/reviews error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to submit a review" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const college = await prisma.college.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const { rating, title, comment } = parsed.data;

    // Create review
    const review = await prisma.review.create({
      data: {
        rating,
        title,
        comment,
        userId: session.user.id,
        collegeId: college.id,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    // Recalculate college average rating and review count
    const stats = await prisma.review.aggregate({
      where: { collegeId: college.id },
      _avg: { rating: true },
      _count: { id: true },
    });

    const updatedRating = Math.round((stats._avg.rating ?? rating) * 10) / 10;
    const updatedReviewCount = stats._count.id;

    await prisma.college.update({
      where: { id: college.id },
      data: {
        rating: updatedRating,
        reviewCount: updatedReviewCount,
      },
    });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    console.error("POST /api/colleges/[id]/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
