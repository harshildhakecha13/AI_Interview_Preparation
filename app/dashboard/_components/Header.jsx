"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import {
  BrainCircuit,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronDown,
  User,
  Zap
} from "lucide-react";

const Header = ({ logo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isLoaded, logout } = useAuth();
  const path = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/resume", label: "Resume Studio" },
    { href: "/dashboard/job-match", label: "Job Match" },
    { href: "/dashboard/practice", label: "Practice Drills" },
    { href: "/dashboard/question", label: "Questions" },
    { href: "/dashboard/upgrade", label: "Pricing" },
    { href: "/dashboard/howit", label: "How It Works" },
  ];

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <Link href="/dashboard" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                MockAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              AI Interview Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = path === href || (href !== "/dashboard" && path?.startsWith(href));
            return (
              <Link key={href} href={href}>
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all inline-block ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Auth & Mobile Menu */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {!isLoaded ? (
            <div className="w-9 h-9 bg-slate-800 rounded-full animate-pulse border border-slate-700" />
          ) : user ? (
            <div className="relative">
              <button
                id="user-menu-button"
                onClick={() => setShowDropdown((p) => !p)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {getInitials(user.firstName || user.username)}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
                    <p className="text-xs font-bold text-white truncate">
                      {user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/dashboard/resume"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      Candidate Profile
                    </Link>
                    <Link
                      href="/dashboard/upgrade"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Subscription Plan
                    </Link>
                  </div>
                  <div className="p-1.5 border-t border-slate-800/80">
                    <button
                      id="logout-button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => router.push("/sign-in")}
              id="login-button"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl px-4 shadow-md shadow-indigo-600/20"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-menu-button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map(({ href, label }) => {
            const isActive = path === href || (href !== "/dashboard" && path?.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setIsOpen(false)}>
                <div
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  {label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Header;

