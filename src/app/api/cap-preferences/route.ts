import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: fetch user's saved preference lists
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lists = await prisma.capPreferenceList.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ data: lists });
  } catch (error) {
    console.error("GET /api/cap-preferences error:", error);
    return NextResponse.json({ error: "Failed to fetch preference lists" }, { status: 500 });
  }
}

// POST: save a preference list
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      id,
      title,
      candidateName,
      applicationId,
      category,
      percentile,
      rank,
      homeUniversity,
      round,
      items,
    } = body;

    if (!candidateName || !category || percentile == null || !items) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert if ID provided, otherwise create new
    if (id) {
      const updated = await prisma.capPreferenceList.update({
        where: { id },
        data: {
          title: title || "My MHT-CET CAP Preference List",
          candidateName,
          applicationId,
          category,
          percentile,
          rank,
          homeUniversity: homeUniversity || "SPPU (Pune University)",
          round: round || "CAP Round 1",
          items,
          userId: session?.user?.id || null,
        },
      });
      return NextResponse.json({ data: updated });
    } else {
      const created = await prisma.capPreferenceList.create({
        data: {
          title: title || "My MHT-CET CAP Preference List",
          candidateName,
          applicationId,
          category,
          percentile,
          rank,
          homeUniversity: homeUniversity || "SPPU (Pune University)",
          round: round || "CAP Round 1",
          items,
          userId: session?.user?.id || null,
        },
      });
      return NextResponse.json({ data: created });
    }
  } catch (error) {
    console.error("POST /api/cap-preferences error:", error);
    return NextResponse.json({ error: "Failed to save preference list" }, { status: 500 });
  }
}

// DELETE: remove a saved preference list
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing list ID" }, { status: 400 });
    }

    await prisma.capPreferenceList.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/cap-preferences error:", error);
    return NextResponse.json({ error: "Failed to delete preference list" }, { status: 500 });
  }
}
