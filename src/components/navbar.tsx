"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, LayoutDashboard, Menu, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/store/auth";
import { dashboardPathForRole } from "@/lib/session";
import { initials as toInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Browse" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out. See you soon!");
    router.replace("/");
    router.refresh();
  };

  const dashboardHref = user ? dashboardPathForRole(user.role) : "/auth/login";

  const navLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      onClick={() => setOpen(false)}
      className={cn(
        "rounded-full px-3 py-2 text-sm font-medium transition-colors",
        pathname === href
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => navLink(link.href, link.label))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {status === "loading" ? (
            <div className="hidden h-9 w-28 animate-pulse rounded-full bg-muted sm:block" />
          ) : user ? (
            <div className="flex items-center gap-1.5">
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href={dashboardHref}>
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none ring-ring/50 transition focus-visible:ring-2">
                  <Avatar className="size-9 border">
                    <AvatarFallback className="bg-brand-gradient text-sm font-semibold text-white">
                      {toInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardHref}>
                      <UserIcon className="size-4" /> My dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="size-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/auth/register">Get started</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-72 flex-col gap-2">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Logo />
              <nav className="mt-4 flex flex-col gap-1">
                {LINKS.map((link) => navLink(link.href, link.label))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 pb-4">
                {user ? (
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link href={dashboardHref}>Open dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/auth/login" onClick={() => setOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/register" onClick={() => setOpen(false)}>
                        Create account
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
