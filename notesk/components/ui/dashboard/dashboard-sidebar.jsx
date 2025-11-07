'use client'

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
// - import { User } from "@supabase/supabase-js"
import Link from "next/link"
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  BarChart3,
  ShoppingCart,
  Building2,
  GraduationCap,
  Heart,
  Briefcase,
  Utensils,
  Car,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/protected/dashboard/admin",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/protected/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Users",
    url: "/protected/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Orders",
    url: "/protected/dashboard/admin/orders",
    icon: ShoppingCart,
  },
]

// Department items with different colors
const departmentItems = [
  {
    title: "Administration",
    url: "/protected/dashboard/departments/administration",
    icon: Building2,
    color: "rounded-full text-blue-600 bg-blue-100",
  },
  {
    title: "School",
    url: "/protected/dashboard/departments/education",
    icon: GraduationCap,
    color: "rounded-full text-green-600 bg-green-100",
  },
  {
    title: "Clinic",
    url: "/protected/dashboard/departments/healthcare",
    icon: Heart,
    color: "rounded-full text-red-600 bg-red-100",
  },
  {
    title: "Maintenance",
    url: "/protected/dashboard/departments/operations",
    icon: Briefcase,
    color: "rounded-full text-purple-600 bg-purple-100",
  },
  {
    title: "Kitchen",
    url: "/protected/dashboard/departments/kitchen",
    icon: Utensils,
    color: "rounded-full text-orange-600 bg-orange-100",
  },
  {
    title: "Logistics",
    url: "/protected/dashboard/departments/transport",
    icon: Car,
    color: "rounded-full text-indigo-600 bg-indigo-100",
  },
]

const settingsItems = [
  {
    title: "Settings",
    url: "/protected/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Home className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Dashboard</span>
            <span className="text-xs">
              {user ? user.email : "Guest"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Departments */}
        <SidebarGroup>
          <SidebarGroupLabel>Departments Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {departmentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={item.color}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          © 2025 ASYV-PWS APP
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
