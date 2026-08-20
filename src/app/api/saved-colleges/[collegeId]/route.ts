import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collegeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { collegeId } = await params;

    // Find the college ID whether passed as ID or slug
    const college = await prisma.college.findFirst({
      where: {
        OR: [{ id: collegeId }, { slug: collegeId }],
      },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    await prisma.savedCollege.deleteMany({
      where: {
        userId: session.user.id,
        collegeId: college.id,
      },
    });

    return NextResponse.json({ message: "College removed from saved list" });
  } catch (error) {
    console.error("DELETE /api/saved-colleges/[collegeId] error:", error);
    return NextResponse.json(
      { error: "Failed to remove saved college" },
      { status: 500 }
    );
  }
}
