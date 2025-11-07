"use client";

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

// --- Supabase Client Component Imports ---
import { useState, useEffect } from "react";
// Use the client-side helper to interact with Supabase in the browser
import createClient from "@/lib/supabase/client";
// -----------------------------------------

// --- Client Component for Sign Out ---
const SupabaseSignOutButton = () => {
    const handleSignOut = async () => {
        // Initialize the client component Supabase instance
        const supabase = createClientComponentClient();
        
        try {
            await supabase.auth.signOut();
            // Redirect the user to the home page or login page after sign out
            window.location.href = '/'; 
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    return (
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            Log out
        </DropdownMenuItem>
    );
};
// -------------------------------------


// Main Client Component
// Removed 'async' keyword
export function DashboardHeader() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Initialize Supabase client
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch the current session to check authentication status
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session) {
                    // If session exists, set the user data from the session
                    setUser(session.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();

        // Listen to auth state changes for real-time updates (e.g., sign out from another tab)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
            } else if (session) {
                setUser(session.user);
            }
        });

        return () => {
            // Clean up the subscription on unmount
            subscription?.unsubscribe();
        };

    }, [supabase]); // Depend on supabase instance

    if (isLoading) {
        // Render a basic loading state while waiting for auth check
        return (
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <p className="animate-pulse text-sm text-gray-500">Loading user...</p>
            </header>
        );
    }

    if (!user) {
        // If not authenticated, return null or a component with a login/sign up link
        return null;
    }
    
    // If authenticated:
    const imageUrl = user.user_metadata?.avatar_url || null;
    const unreadCount = 2; // Static for now

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/protected/dashboard/admin/users">Users</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Overview</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
                {/* <div className="relative hidden md:block">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8 w-[200px] lg:w-[300px]" />
                </div> */}
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
                            {imageUrl ? (
                                <img 
                                    className="bg-gray-300 rounded-full h-full w-full object-cover" 
                                    src={imageUrl} 
                                    alt="Profile Image" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/9ca3af/ffffff?text=U' }}
                                />
                            ) : <User className="h-4 w-4" />}
                            <span className="sr-only">User menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Account Info</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><a href="/dashboard/admin/profile">Profile</a></DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <SupabaseSignOutButton />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
