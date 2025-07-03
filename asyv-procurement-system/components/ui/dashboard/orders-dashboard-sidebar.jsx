'use client'

import { Calendar, Home, Inbox, Search, Settings, Users, BarChart3, ShoppingCart, Building2, GraduationCap, Heart,Briefcase, Utensils, Car,  } from "lucide-react"
import { useUser } from "@clerk/nextjs"

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
    title: "Maintanance",
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
  const { user } = useUser()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Home className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Dashboard</span>
            <span className="text-xs">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Departments sider bar group */}
        <SidebarGroup>
          <SidebarGroupLabel>Departments</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {departmentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={item.color}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">© 2025 ASYV-PWS APP</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
