import { DashboardHeader } from "@/components/ui/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset } from "@/components/ui/sidebar"
// Update the path to the correct location of the prisma module
import { prisma } from "@/lib/prisma"; // make sure your Prisma client is imported
import Component from "@/components/ui/chart-area-interactive"

export default async function DashboardPage() {
  const users = await prisma.profile.count();
  const requests = await prisma.ProcurementRequest.count();
  const allProcurementRequests = await prisma.ProcurementRequest.findMany();
  // const totalItems = prisma.ProcurementRequest.items;

  const totalRevenue = allProcurementRequests.reduce((acc, curr) => {

    const currentRevenue = curr.items.reduce((accumulator, current) => accumulator + current.totalPrice, 0)

    return acc + currentRevenue

  }, 0)

  const totalItems = allProcurementRequests.reduce((accs, currs) => {
    // const totalCurrentItems = currs.items.reduce((accumulators, currentItems) => ( accumulators + currentItems.length ))
    return accs + currs.items.length
  }, 0)

  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Active users this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-600 font-bold">+12</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Total revenue this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(3)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-600 font-bold">+8</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Total orders this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-600 font-bold">+15</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardDescription>Total items this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-600 font-bold">+15</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <div className="w-full">
            <Component />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
