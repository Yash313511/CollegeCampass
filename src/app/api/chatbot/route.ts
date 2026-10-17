import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface ChatRequestBody {
  message: string;
  sessionId: string;
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

// ─── Simple Entity Extraction Helpers ───────────────────────────

const CITIES = [
  "pune", "mumbai", "delhi", "bangalore", "bengaluru", "hyderabad",
  "chennai", "kolkata", "nagpur", "nashik", "aurangabad", "ahmedabad",
];

const STATES = [
  "maharashtra", "karnataka", "delhi", "tamil nadu", "telangana",
  "gujarat", "uttar pradesh", "rajasthan",
];

const STREAMS = [
  "engineering", "computer", "information technology", "mechanical",
  "civil", "electrical", "electronics", "management", "mba", "medical",
  "mbbs", "pharmacy", "law", "design", "science", "commerce", "arts",
];

function extractKeywords(text: string) {
  const lower = text.toLowerCase();
  const foundCity = CITIES.find((c) => lower.includes(c));
  const foundState = STATES.find((s) => lower.includes(s));
  const foundStream = STREAMS.find((s) => lower.includes(s));

  // Extract budget (e.g., "under 2 lakh", "200000", "1.5 lakh")
  let budget: number | undefined;
  const lakhMatch = lower.match(/(?:under|below|within|upto|budget(?:\s+of)?)\s*(?:₹|rs\.?)?\s*([0-9.]+)\s*lakh/i);
  if (lakhMatch) {
    budget = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else {
    const rawNumberMatch = lower.match(/(?:under|below|within|upto|budget(?:\s+of)?)\s*(?:₹|rs\.?)?\s*([0-9]{4,7})/i);
    if (rawNumberMatch) {
      budget = parseInt(rawNumberMatch[1], 10);
    }
  }

  // Extract percentile (e.g., "95 percentile", "95.5%")
  let percentile: number | undefined;
  const percentileMatch = lower.match(/([0-9]{1,2}(?:\.[0-9]{1,4})?)\s*(?:percentile|%tile|%)/i);
  if (percentileMatch) {
    const p = parseFloat(percentileMatch[1]);
    if (p > 0 && p <= 100) percentile = p;
  }

  const isCapRelated =
    lower.includes("cap") ||
    lower.includes("mht-cet") ||
    lower.includes("mht cet") ||
    lower.includes("cutoff") ||
    lower.includes("percentile") ||
    lower.includes("choice code") ||
    lower.includes("round 1") ||
    lower.includes("round 2");

  const isScholarshipRelated =
    lower.includes("scholarship") ||
    lower.includes("financial aid") ||
    lower.includes("freeship") ||
    lower.includes("fee concession");

  const isCompareRelated =
    lower.includes("compare") ||
    lower.includes(" vs ") ||
    lower.includes("versus") ||
    lower.includes("difference between");

  return {
    city: foundCity,
    state: foundState,
    stream: foundStream,
    budget,
    percentile,
    isCapRelated,
    isScholarshipRelated,
    isCompareRelated,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { message, sessionId, conversationHistory = [] } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required and must not be empty" },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message exceeds maximum length of 2000 characters" },
        { status: 400 }
      );
    }

    const keywords = extractKeywords(message);

    // ─── 1. Query Prisma for Colleges ──────────────────────────────
    const collegeWhere: Prisma.CollegeWhereInput = {};

    if (keywords.city) {
      collegeWhere.city = { contains: keywords.city, mode: "insensitive" };
    }
    if (keywords.state) {
      collegeWhere.state = { contains: keywords.state, mode: "insensitive" };
    }
    if (keywords.budget) {
      collegeWhere.feesMin = { lte: keywords.budget };
    }
    if (keywords.stream) {
      collegeWhere.courses = {
        some: {
          OR: [
            { stream: { contains: keywords.stream, mode: "insensitive" } },
            { name: { contains: keywords.stream, mode: "insensitive" } },
          ],
        },
      };
    }

    // If query mentions specific words, search name
    const words = message
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["what", "which", "tell", "best", "good", "some", "suggest", "about", "colleges", "college"].includes(w.toLowerCase()));
    if (words.length > 0 && !keywords.city && !keywords.state) {
      collegeWhere.OR = words.slice(0, 3).map((w) => ({
        name: { contains: w, mode: "insensitive" },
      }));
    }

    const colleges = await prisma.college.findMany({
      where: collegeWhere,
      take: 12,
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
      include: {
        courses: {
          select: {
            name: true,
            stream: true,
            duration: true,
            fees: true,
            eligibility: true,
          },
          take: 5,
        },
        cutoffs: {
          select: {
            exam: true,
            category: true,
            course: true,
            closingRank: true,
            year: true,
          },
          take: 5,
        },
      },
    });

    const collegesContext = colleges.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      city: c.city,
      state: c.state,
      type: c.type,
      rating: c.rating,
      feesMin: c.feesMin,
      feesMax: c.feesMax,
      avgPackage: c.avgPackage,
      highestPackage: c.highestPackage,
      placementRate: c.placementRate,
      accreditation: c.accreditation,
      website: c.website,
      establishedYear: c.establishedYear,
      description: c.description,
      streams: Array.from(new Set(c.courses.map((cr) => cr.stream))),
      courses: c.courses,
      cutoffs: c.cutoffs,
    }));

    // ─── 2. Query CAP Colleges if query is CAP / CET related ────────
    let capCollegesContext: any[] = [];
    if (keywords.isCapRelated) {
      const capWhere: Prisma.CapCollegeWhereInput = {};
      if (keywords.budget) {
        capWhere.feesAnnual = { lte: keywords.budget };
      }

      const capColleges = await prisma.capCollege.findMany({
        where: capWhere,
        take: 8,
        orderBy: [{ rating: "desc" }],
        include: {
          courses: {
            take: 4,
            include: {
              cutoffs: {
                take: 5,
                orderBy: { round: "desc" },
              },
            },
          },
        },
      });

      capCollegesContext = capColleges.map((c) => ({
        id: c.id,
        collegeCode: c.collegeCode,
        name: c.name,
        slug: c.slug,
        status: c.status,
        region: c.region,
        feesAnnual: c.feesAnnual,
        avgPackage: c.avgPackage,
        highestPackage: c.highestPackage,
        rating: c.rating,
        accreditation: c.accreditation,
        courses: c.courses.map((cr) => ({
          choiceCode: cr.choiceCode,
          courseName: cr.courseName,
          stream: cr.stream,
          intake: cr.intake,
          cutoffs: cr.cutoffs.map((ct) => ({
            category: ct.category,
            homeUniversityPercentile: ct.homeUniversityPercentile,
            stateLevelPercentile: ct.stateLevelPercentile,
            round: ct.round,
            year: ct.year,
          })),
        })),
      }));
    }

    // ─── 3. Query Scholarships if query is Scholarship related ──────
    let scholarshipsContext: any[] = [];
    if (keywords.isScholarshipRelated) {
      const scholarships = await prisma.scholarship.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      });

      scholarshipsContext = scholarships.map((s) => ({
        id: s.id,
        name: s.name,
        provider: s.provider,
        description: s.description,
        type: s.type,
        level: s.level,
        amount: s.amount,
        eligibility: s.eligibility,
        deadline: s.deadline,
        applicationLink: s.applicationLink,
        streams: s.streams,
        categories: s.categories,
      }));
    }

    // ─── 4. Forward to FastAPI Chatbot Service ──────────────────────
    const chatbotServiceUrl =
      process.env.CHATBOT_SERVICE_URL || "http://localhost:8000";
    const serviceToken =
      process.env.CHATBOT_SERVICE_TOKEN || "change-me-to-a-random-secret";

    const payload = {
      message,
      session_id: sessionId || `session_${Date.now()}`,
      conversation_history: conversationHistory.slice(-6).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
      colleges: collegesContext,
      cap_colleges: capCollegesContext,
      scholarships: scholarshipsContext,
      detected_intent: keywords.isCapRelated
        ? "cap_round"
        : keywords.isCompareRelated
        ? "comparison"
        : keywords.isScholarshipRelated
        ? "scholarship"
        : undefined,
      user_preferences: {
        city: keywords.city,
        state: keywords.state,
        stream: keywords.stream,
        budget: keywords.budget,
        percentile: keywords.percentile,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const fastapiRes = await fetch(`${chatbotServiceUrl}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceToken}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (fastapiRes.ok) {
        const data = await fastapiRes.json();
        return NextResponse.json(data);
      } else {
        const errText = await fastapiRes.text();
        console.warn(`FastAPI service responded with error status ${fastapiRes.status}: ${errText}`);
      }
    } catch (err) {
      console.warn("Could not reach FastAPI chatbot service, using intelligent local fallback:", err);
    }

    // ─── 5. Fallback Response (Database-grounded when FastAPI offline) ──
    const collegeCards = collegesContext.slice(0, 6).map((c, idx) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      city: c.city,
      state: c.state,
      type: c.type,
      rating: c.rating,
      feesMin: c.feesMin,
      feesMax: c.feesMax,
      avgPackage: c.avgPackage,
      placementRate: c.placementRate,
      accreditation: c.accreditation,
      matchReason: `High-ranked institute in ${c.city || c.state}${c.avgPackage ? ` with average package ₹${c.avgPackage} LPA` : ""}`,
      matchScore: 90 - idx * 4,
      streams: c.streams,
    }));

    let answer = "";
    if (collegeCards.length > 0) {
      answer = `Based on your query, I found **${collegeCards.length} matching institutions** in our database:\n\n` +
        collegeCards.map((c, i) =>
          `**${i + 1}. ${c.name}** (${c.city}, ${c.state})\n` +
          `• Rating: ${c.rating}/5.0 | Fees: ₹${c.feesMin?.toLocaleString() || "N/A"}/yr${c.avgPackage ? ` | Avg Package: ₹${c.avgPackage} LPA` : ""}`
        ).join("\n\n") +
        "\n\nYou can click on any college card below to explore full cutoff trends, campus facilities, and placement statistics.";
    } else if (keywords.isScholarshipRelated && scholarshipsContext.length > 0) {
      answer = `Here are **${scholarshipsContext.length} available scholarships** matching your interests:\n\n` +
        scholarshipsContext.map((s) => `• **${s.name}** (${s.provider}) — ${s.amount}\n  Eligibility: ${s.eligibility}`).join("\n\n");
    } else {
      answer = "Hello! I'm your CollegeCompass AI Assistant. I can help you discover top colleges, check MHT-CET and JEE cutoffs, analyze Maharashtra CAP rounds, compare universities side-by-side, and explore scholarships.\n\nTry asking:\n• *\"Suggest top engineering colleges in Pune under ₹2 Lakh budget\"*\n• *\"What colleges can I get with 92 percentile in MHT-CET?\"*\n• *\"Compare COEP Technological University and VJTI Mumbai\"*";
    }

    return NextResponse.json({
      answer,
      intent: keywords.isCapRelated ? "cap_round" : "college_search",
      college_cards: collegeCards,
      comparison: null,
      sources: collegeCards.map((c) => ({
        title: c.name,
        source_type: "database",
        detail: `Verified record for ${c.city}, ${c.state}`,
      })),
      follow_up_questions: [
        "What are the cutoff percentiles for Computer Engineering?",
        "Show me colleges with average packages above 8 LPA",
        "Compare these colleges side-by-side",
      ],
      confidence: "high",
      data_freshness: "2024-25",
      disclaimer: "Cutoff data is based on historical admission records. Verify with official DTE portals.",
    });
  } catch (error) {
    console.error("Chatbot API route error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to process chat query. Please try again.",
      },
      { status: 500 }
    );
  }
}
