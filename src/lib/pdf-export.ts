import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PdfExportOptions } from "@/types/cap";

/**
 * Generates and downloads a beautifully styled, official Maharashtra DTE CAP
 * Option Form / Preference List PDF document for Pune Region Colleges.
 */
export function generateCapPreferencePdf(options: PdfExportOptions): void {
  const {
    candidateName,
    applicationId = "EN25" + Math.floor(100000 + Math.random() * 900000),
    cetRollNo = "240" + Math.floor(10000 + Math.random() * 90000),
    category,
    percentile,
    rank,
    homeUniversity,
    round,
    items,
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const primaryColor: [number, number, number] = [15, 23, 42]; // slate-900
  const accentColor: [number, number, number] = [37, 99, 235]; // blue-600
  const emeraldColor: [number, number, number] = [16, 185, 129]; // emerald-500
  const amberColor: [number, number, number] = [217, 119, 6]; // amber-600
  const purpleColor: [number, number, number] = [147, 51, 234]; // purple-600

  // ─── Header Band ───────────────────────────────────────────────────────────
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 28, "F");

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("MAHARASHTRA STATE CET CELL • CENTRALIZED ADMISSION PROCESS", 14, 11);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240); // slate-200
  doc.text(
    `B.E. / B.Tech Admissions 2025–26 • Pune Region Official Choice Option Form (${round})`,
    14,
    18
  );

  // CollegeCompass Badge
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(147, 197, 253); // blue-300
  doc.text("CollegeCompass™ Smart Planner", pageWidth - 14, 11, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`, pageWidth - 14, 18, { align: "right" });

  // ─── Candidate Profile Card (Top Meta) ──────────────────────────────────────
  const cardY = 32;
  const cardH = 34;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.roundedRect(14, cardY, pageWidth - 28, cardH, 2, 2, "FD");

  // Title of Card
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("CANDIDATE ADMISSION PROFILE & MERIT CREDENTIALS", 18, cardY + 7);

  // Left Column Details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("Candidate Name:", 18, cardY + 14);
  doc.text("Application ID / Roll No:", 18, cardY + 20);
  doc.text("Admission Category / Caste:", 18, cardY + 26);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(candidateName || "Candidate", 58, cardY + 14);
  doc.text(`${applicationId} / ${cetRollNo}`, 58, cardY + 20);
  doc.text(category || "General / Open", 58, cardY + 26);

  // Right Column Details
  const rightColX = pageWidth / 2 + 10;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("MHT-CET Percentile:", rightColX, cardY + 14);
  doc.text("Merit Rank (State / AI):", rightColX, cardY + 20);
  doc.text("Home University Quota:", rightColX, cardY + 26);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(`${percentile.toFixed(2)} %ile`, rightColX + 40, cardY + 14);

  doc.setTextColor(15, 23, 42);
  doc.text(rank ? `#${rank.toLocaleString("en-IN")}` : "As per CET Merit List", rightColX + 40, cardY + 20);
  doc.text(homeUniversity || "SPPU (Pune University)", rightColX + 40, cardY + 26);

  // ─── Table of Selected Choices ─────────────────────────────────────────────
  const tableRows = items.map((item, idx) => {
    return [
      `#${idx + 1}`,
      item.choiceCode,
      `[${item.collegeCode}] ${item.collegeName}`,
      item.courseName,
      item.status || "Autonomous",
      `${item.cutoffPercentile ? item.cutoffPercentile.toFixed(2) + "%" : "N/A"}`,
      item.chance.toUpperCase(),
    ];
  });

  autoTable(doc, {
    startY: cardY + cardH + 5,
    head: [
      [
        "Pref",
        "Choice Code",
        "Institute Code & Name",
        "Branch / Course Name",
        "Status",
        "Cutoff %",
        "Chance",
      ],
    ],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [30, 41, 59], // slate-800
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2.2,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center", fontStyle: "bold" },
      1: { cellWidth: 24, fontStyle: "bold", textColor: [37, 99, 235] },
      2: { cellWidth: 56 },
      3: { cellWidth: 42 },
      4: { cellWidth: 20 },
      5: { cellWidth: 16, halign: "right", fontStyle: "bold" },
      6: { cellWidth: 16, halign: "center", fontStyle: "bold" },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: function (data) {
      // Colorize the chance column
      if (data.section === "body" && data.column.index === 6) {
        const text = String(data.cell.raw).toUpperCase();
        if (text === "SAFE") {
          data.cell.styles.textColor = emeraldColor;
        } else if (text === "TARGET") {
          data.cell.styles.textColor = amberColor;
        } else if (text === "DREAM" || text === "REACH") {
          data.cell.styles.textColor = purpleColor;
        }
      }
    },
    margin: { left: 14, right: 14, bottom: 25 },
  });

  // ─── Summary & Guidelines Box ──────────────────────────────────────────────
  // @ts-expect-error - jsPDF autoTable extension defines lastAutoTable
  const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 180) + 6;

  // Check if we need a new page for notes
  if (finalY > pageHeight - 45) {
    doc.addPage();
  }

  const currentY = finalY > pageHeight - 45 ? 16 : finalY;

  // Stats Box
  const safeCount = items.filter((i) => i.chance === "Safe").length;
  const targetCount = items.filter((i) => i.chance === "Target").length;
  const dreamCount = items.filter((i) => i.chance === "Dream" || i.chance === "Reach").length;

  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, currentY, pageWidth - 28, 28, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `PREFERENCE LIST SUMMARY: ${items.length} Choices Selected (Safe: ${safeCount} • Target: ${targetCount} • Dream: ${dreamCount})`,
    18,
    currentY + 6
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(
    "1. Auto-Freeze Rule: If Preference #1 is allotted in CAP Round 1, seat is AUTO-FROZEN. Candidate cannot participate in subsequent rounds.",
    18,
    currentY + 12
  );
  doc.text(
    "2. Betterment / Float Rule: If Preference #2 or below is allotted, candidate can accept seat with 'Betterment' to compete for higher choices in Round 2.",
    18,
    currentY + 17
  );
  doc.text(
    "3. Verification: Verify all 9-digit Choice Codes against your category (GOPEN/GOBC/GSC/EWS/TFWS) on the official mahacet.org portal before final submission.",
    18,
    currentY + 22
  );

  // ─── Footer on All Pages ───────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `CollegeCompass • Pune Region CAP Option Form • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
    doc.text(
      "CONFIDENTIAL & UNOFFICIAL ADVISORY • CHECK OFFICIAL CET PORTAL BEFORE CONFIRMING",
      pageWidth - 14,
      pageHeight - 8,
      { align: "right" }
    );
  }

  // Sanitize filename and save
  const sanitizedName = (candidateName || "Student").replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `MHT_CET_CAP_Preferences_${sanitizedName}_${percentile.toFixed(1)}pct.pdf`;
  doc.save(fileName);
}
