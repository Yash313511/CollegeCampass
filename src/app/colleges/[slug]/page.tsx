import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CollegeDetail } from "@/types";
import { CollegeDetailClient } from "./CollegeDetailClient";

export interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const college = await prisma.college.findFirst({
    where: {
      OR: [{ slug: slug }, { id: slug }],
    },
    select: {
      name: true,
      city: true,
      state: true,
      description: true,
      feesMin: true,
      feesMax: true,
      avgPackage: true,
    },
  });

  if (!college) {
    return {
      title: "College Not Found | CollegeCompass",
    };
  }

  return {
    title: `${college.name}, ${college.city} — Fees, Placements, Courses & Reviews`,
    description: `Explore ${college.name} located in ${college.city}, ${college.state}. Check annual fees, average package (${college.avgPackage} LPA), offered courses, and student reviews.`,
    openGraph: {
      title: `${college.name} — CollegeCompass`,
      description: `Comprehensive admission guide, fees, placements, and courses for ${college.name}.`,
    },
  };
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  const college = await prisma.college.findFirst({
    where: {
      OR: [{ slug: slug }, { id: slug }],
    },
    include: {
      courses: {
        orderBy: { stream: "asc" },
      },
      reviews: {
        include: {
          user: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!college) {
    notFound();
  }

  // Check if saved by current user
  let isSaved = false;
  if (session?.user?.id) {
    const saved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: college.id,
        },
      },
    });
    isSaved = !!saved;
  }

  // Format data for client component
  const formattedCollege: CollegeDetail = {
    ...college,
    reviews: college.reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return (
    <CollegeDetailClient
      college={formattedCollege}
      initialIsSaved={isSaved}
    />
  );
}
