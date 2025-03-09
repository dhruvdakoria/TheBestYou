"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  Home,
  Dumbbell,
  Utensils,
  LineChart,
  LayoutDashboard,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-border bg-background py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold flex items-center gap-2"
          >
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-extrabold">
              TheBestYou
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 ml-10">
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${pathname === "/dashboard" ? "text-primary" : "text-foreground"} hover:text-primary transition-colors flex items-center gap-2`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/workouts"
              className={`text-sm font-medium ${pathname.includes("/dashboard/workouts") ? "text-primary" : "text-foreground"} hover:text-primary transition-colors flex items-center gap-2`}
            >
              <Dumbbell className="h-4 w-4" />
              Workouts
            </Link>
            <Link
              href="/dashboard/nutrition"
              className={`text-sm font-medium ${pathname.includes("/dashboard/nutrition") ? "text-primary" : "text-foreground"} hover:text-primary transition-colors flex items-center gap-2`}
            >
              <Utensils className="h-4 w-4" />
              Nutrition
            </Link>
            <Link
              href="/dashboard/habits"
              className={`text-sm font-medium ${pathname.includes("/dashboard/habits") ? "text-primary" : "text-foreground"} hover:text-primary transition-colors flex items-center gap-2`}
            >
              <LineChart className="h-4 w-4" />
              Habits
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/dashboard/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
