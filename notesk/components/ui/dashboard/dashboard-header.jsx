import { Bell, Search, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// 1. SUPABASE IMPORTS
import { createClient } from "@/lib/supabase/server";

// 2. Component must be async to fetch data on the server
export async function DashboardHeader() {
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

  // For simplicity, we'll use a placeholder or rely on a generic avatar.
  const avatarUrl = cuser?.user_metadata?.avatar_url || null; 

  const unreadCount = 2

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/protected/dashboard/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        
        {/* ... (Notifications Dropdown Menu remains the same) ... */}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-gray-300 rounded-full">
              {/* Replaced user.imageUrl with avatarUrl (or email if no avatar) */}
              { user ? (
                  avatarUrl ? (
                    <img className="bg-gray-300 rounded-full" src={avatarUrl} alt="Profile Image" />
                  ) : (
                    // Fallback to the first letter of the email or a generic icon
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                        {user.email ? user.email[0].toUpperCase() : <UserIcon className="h-4 w-4" />}
                    </div>
                  )
              ) : <UserIcon className="h-4 w-4" />}
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
                {/* Display user's email or a placeholder */}
                {user ? user.email : "Account Info"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><a href="/dashboard/profile">Profile</a></DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* 3. REPLACED <SignOutButton> WITH CUSTOM LOGOUT BUTTON */}
            {user && (
              <DropdownMenuItem asChild>
                {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}