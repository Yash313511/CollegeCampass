"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { CompareProvider } from "@/context/CompareContext";
import { CompareBar } from "@/components/compare/CompareBar";
import { Chatbot } from "@/components/chatbot/Chatbot";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CompareProvider>
        {children}
        <CompareBar />
        <Chatbot />
      </CompareProvider>
    </SessionProvider>
  );
}
