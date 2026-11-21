"use client";
import React, { useState, useEffect, useRef } from "react";
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
  LayoutDashboard,
  FileText,
  Zap,
  HelpCircle,
  DollarSign,
  BookOpen,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/resume", label: "Resume Studio", icon: FileText },
  { href: "/dashboard/practice", label: "Practice Drills", icon: Zap },
  { href: "/dashboard/question", label: "Questions", icon: BookOpen },
  { href: "/dashboard/upgrade", label: "Pricing", icon: DollarSign },
  { href: "/dashboard/howit", label: "How It Works", icon: HelpCircle },
];

const Header = ({ logo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoaded, logout } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const isActive = (href) =>
    href === "/dashboard" ? path === href : path?.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-xl shadow-black/20" : ""
      }`}
      style={{
        background: "rgba(2,8,23,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col -space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                MockAI
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md"
                style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" }}>
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:block">AI Interview Platform</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href}>
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    active
                      ? "text-indigo-300"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                  }`}
                  style={active ? {
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  } : {}}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-indigo-400" : "text-slate-500"}`} />
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2.5">
          <ModeToggle />

          {!isLoaded ? (
            <div className="w-9 h-9 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                id="user-menu-button"
                onClick={() => setShowDropdown((p) => !p)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full transition-all duration-200 focus:outline-none group"
                style={{
                  background: showDropdown ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${showDropdown ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
                >
                  {getInitials(user.firstName || user.username)}
                </div>
                <span className="text-xs text-slate-300 hidden sm:block max-w-[80px] truncate font-medium">
                  {user.firstName || user.username?.split("@")[0]}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-58 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  style={{
                    width: "220px",
                    background: "rgba(10,18,35,0.95)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
                  }}
                >
                  <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(99,102,241,0.04)" }}>
                    <p className="text-xs font-bold text-white truncate">
                      {user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <Link
                      href="/dashboard/resume"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white rounded-xl transition-all duration-150"
                      style={{ hover: { background: "rgba(255,255,255,0.05)" } }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      Candidate Profile
                    </Link>
                    <Link
                      href="/dashboard/upgrade"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white rounded-xl transition-all duration-150"
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Subscription Plan
                    </Link>
                  </div>
                  <div className="p-1.5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <button
                      id="logout-button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-all duration-150"
                      style={{ color: "#fb7185" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(251,113,133,0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
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
              className="text-xs font-semibold rounded-xl px-4 shadow-md transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 4px 15px rgba(99,102,241,0.25)" }}
            >
              Sign In
            </Button>
          )}

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl transition-all duration-200 focus:outline-none"
            style={{
              background: isOpen ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isOpen ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.07)"}`,
              color: isOpen ? "#a5b4fc" : "#94a3b8",
            }}
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="lg:hidden border-t px-4 py-3 space-y-1"
          style={{
            borderColor: "rgba(255,255,255,0.05)",
            background: "rgba(2,8,23,0.97)",
          }}
        >
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} onClick={() => setIsOpen(false)}>
                <div
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    active ? "text-indigo-300" : "text-slate-400"
                  }`}
                  style={active ? {
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.18)",
                  } : {}}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-indigo-400" : "text-slate-500"}`} />
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
