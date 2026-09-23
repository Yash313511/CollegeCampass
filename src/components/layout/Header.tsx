"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Compass, Bookmark, Scale, Sparkles, Menu, X, LogOut, User, Search, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getInitials } from "@/lib/utils";

import { Logo } from "@/components/ui/Logo";

export function Header() {
  const pathname = usePathname();
  const sessionRes = useSession();
  const session = sessionRes?.data;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/colleges", label: "Colleges", icon: Compass },
    { href: "/compare", label: "Compare", icon: Scale },
    { href: "/predictor", label: "Predictor", icon: Sparkles },
    { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
    { href: "/cap-round", label: "CAP Round", icon: FileText, highlight: true },
    { href: "/saved", label: "Saved", icon: Bookmark, authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Logo size="md" linkHref="/" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              if (link.authRequired && !session?.user) {
                return null;
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : (link as { highlight?: boolean }).highlight
                      ? "text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-slate-900" : (link as { highlight?: boolean }).highlight ? "text-orange-500" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                  {(link as { highlight?: boolean }).highlight && !isActive && (
                    <span className="ml-0.5 px-1 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-600 leading-none">
                      PUNE
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Right: Search / Actions / Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Search Shortcut */}
          <Link
            href="/colleges"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Search colleges...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">⌘K</kbd>
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/saved"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Bookmark className="h-4 w-4 text-slate-400" />
                <span>Saved</span>
              </Link>
              
              {/* User Profile matching BizLink style */}
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs"
                  title={session.user.name || session.user.email || ""}
                >
                  {getInitials(session.user.name || session.user.email || "U")}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 max-w-[110px] truncate leading-tight">
                    {session.user.name || "Student User"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Verified
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ml-1"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              if (link.authRequired && !session?.user) {
                return null;
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : (link as { highlight?: boolean }).highlight
                      ? "text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? "text-slate-900" : (link as { highlight?: boolean }).highlight ? "text-orange-500" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                  </div>
                  {(link as { highlight?: boolean }).highlight && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600">
                      PUNE DTE
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {session?.user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-900 font-medium bg-slate-50 rounded-lg">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>{session.user.name || session.user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="primary" size="sm" className="w-full justify-center">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
