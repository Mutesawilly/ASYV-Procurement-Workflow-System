// --- Supabase Server Component Imports ---
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
// -----------------------------------------

// --- UI & Icon Imports (No Change) ---
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// --- CUSTOM Supabase Sign Out Component ---
// This will be a Client Component defined below
// import { SupabaseSignOutButton } from "@/components/auth/supabase-sign-out-button";
// ----------------------------------------

/**
 * Fetches the user session and profile data using Supabase.
 * @returns {Promise<{id: string, avatar_url: string, email: string} | null>}
 */
async function getUserProfile() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  // 2. Fetch the user's profile data from a 'profiles' table
  // Adjust 'avatar_url' and table name 'profiles' as per your schema.
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, avatar_url")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    console.error("Error fetching user profile:", error);
    // Fallback if no specific profile table exists or fetch fails
    return {
      id: session.user.id,
      avatar_url: session.user.user_metadata.avatar_url || "",
      email: session.user.email || "",
    };
  }

  return {
    id: profile.id,
    avatar_url: profile.avatar_url,
    email: session.user.email || "",
  };
}

export async function DashboardHeader() {
  // CLERK REPLACEMENT: Replaces await currentUser()
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  // console.log("User:", user);

  const cuser = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  // console.log("Cuser:", cuser);

  if (!cuser) {
    redirect("/");
  }

  // CLERK REPLACEMENT: Changed from user.imageUrl to user.avatar_url
  const { avatar_url } = user;

  const unreadCount = 2; // Static placeholder

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/protected/dashboard/admin">Orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications Dropdown (No Change) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-0 -right-0 h-4 w-4 flex items-center rounded-full justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            {/* add the notifications here */}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-gray-300 rounded-full">
              {/* Using avatar_url */}
              {user && avatar_url ? (
                <img
                  className="bg-gray-300 rounded-full"
                  src={avatar_url}
                  alt="Profile Image"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Account Info</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><a href="/dashboard/profile">Profile</a></DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {/* CLERK REPLACEMENT: Replaced <SignOutButton> with custom Supabase component */}
              {/* <SupabaseSignOutButton>Log out</SupabaseSignOutButton> */}
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}