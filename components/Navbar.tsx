"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/DarkMode";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Home, BarChart2, Zap } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="w-4 h-4" />,
      active: pathname === "/",
    },
    {
      name: "Dashboard",
      href: "/dashboard/forms",
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: pathname.startsWith("/dashboard/forms"),
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart2 className="w-4 h-4" />,
      active: pathname.startsWith("/dashboard/analytics"),
    },
    {
      name: "Upgrade Plan",
      href: "/dashboard/upgrade",
      icon: <Zap className="w-4 h-4 text-violet-400 fill-violet-400/20" />,
      active: pathname.startsWith("/dashboard/upgrade"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Left Side: Logo and Navigation Links */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 h-9 px-3 text-sm font-medium transition-all duration-200 rounded-md",
                    item.active
                      ? "bg-secondary text-secondary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Theme Toggle and Auth buttons */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedIn>
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 border-2 border-primary/10 hover:border-primary/30 transition-all",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all duration-200">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
