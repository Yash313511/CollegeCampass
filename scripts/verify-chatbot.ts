import dotenv from "dotenv";
dotenv.config();

import { POST } from "../src/app/api/chatbot/route";
import { NextRequest } from "next/server";

async function runTests() {
  console.log("=== Testing Next.js /api/chatbot Integration Route ===");

  const queries = [
    "Hello! How can you help me?",
    "Suggest top engineering colleges in Pune under 2 lakh",
    "What colleges can I get with 92 percentile in MHT-CET?",
    "Are there any scholarships for engineering students?",
  ];

  for (const q of queries) {
    console.log(`\n--- Query: "${q}" ---`);
    const req = new NextRequest("http://localhost:3000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: q,
        sessionId: "test-session-123",
      }),
    });

    const res = await POST(req);
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Answer: ${data.answer?.slice(0, 150)}...`);
    console.log(`Intent: ${data.intent}`);
    console.log(`College Cards Returned: ${data.college_cards?.length || 0}`);
    console.log(`Sources: ${data.sources?.length || 0}`);
    console.log(`Follow-up Questions: ${data.follow_up_questions?.length || 0}`);
  }

  console.log("\n=== All Integration Tests Completed Successfully! ===");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
