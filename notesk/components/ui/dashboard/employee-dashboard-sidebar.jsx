'use client'

import { Calendar, Home, Inbox, Search, Settings, Users, BarChart3, ShoppingCart, Building2, GraduationCap, Heart, Briefcase, Utensils, Car, } from "lucide-react"
import { fetchProcurementRequests } from "@/app/actions/fetchProcurementRequests"

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
import { useEffect, useState } from "react"


export function AppSidebar() {
  const [procurementRequests, setProcurementRequests] = useState([])

  useEffect(() => {
    (async () => {
      let data = await fetchProcurementRequests()
      setProcurementRequests(data || [])
    })()
  }, [])

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
        {/* Departments sider bar group */}
        <SidebarGroup>
          <SidebarGroupLabel>Recent Requests</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {procurementRequests.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton>
                    <p className="bg-purple-400 py-1 px-4 rounded-full">{item.title}</p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">© 2025 ASYV-PWS APP</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
