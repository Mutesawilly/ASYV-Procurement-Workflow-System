import { DashboardHeader } from "@/components/ui/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset } from "@/components/ui/sidebar"

export default function DashboardPage() {
  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Active users this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,543</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Total revenue this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Total orders this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Your dashboard analytics and insights</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[320px]">
              <p className="text-muted-foreground">Chart placeholder - Add your analytics here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
