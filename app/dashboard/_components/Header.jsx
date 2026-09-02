"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const Header = ({ logo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isLoaded, logout } = useAuth();
  const path = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/question", label: "Questions" },
    { href: "/dashboard/upgrade", label: "Upgrade" },
    { href: "/dashboard/howit", label: "How it works?" },
  ];

  const handleLogout = async () => {
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
    <div className="bg-secondary shadow-sm">
      <div className="w-[80%] m-auto flex gap-4 items-center justify-between">
        <Link className="hidden md:block" href="/dashboard">
          <Image src={logo} width={80} height={80} alt="logo" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}>
              <li
                className={`hover:text-black hover:font-bold transition-all cursor-pointer ${
                  path === href && "text-black font-bold"
                }`}
              >
                {label}
              </li>
            </Link>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            id="mobile-menu-button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Auth Zone */}
        <div className="flex gap-4 items-center">
          <ModeToggle />
          {!isLoaded ? (
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                id="user-menu-button"
                onClick={() => setShowDropdown((p) => !p)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm select-none">
                  {getInitials(user.firstName || user.username)}
                </div>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.firstName || user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                  <button
                    id="logout-button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={() => router.push("/sign-in")} id="login-button">
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-5">
            <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href}>
                  <li
                    className={`hover:text-black hover:font-bold transition-all cursor-pointer ${
                      path === href && "text-black font-bold"
                    }`}
                  >
                    {label}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
