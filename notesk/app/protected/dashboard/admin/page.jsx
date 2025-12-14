import { DashboardHeader } from "@/components/ui/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset } from "@/components/ui/sidebar"
// Update the path to the correct location of the prisma module
import { prisma } from "@/lib/prisma"; // make sure your Prisma client is imported
import Component from "@/components/ui/chart-area-interactive"

export default async function DashboardPage() {
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  // Current month data
  const currentMonthUsers = await prisma.Profile.count({
    where: {
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  })

  const currentMonthRequests = await prisma.ProcurementRequest.findMany({
    where: {
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
    include: {
      ProcurementItems: true,
    },
  })

  const currentMonthRevenue = currentMonthRequests.reduce((acc, curr) => {
    const currentRevenue = curr.ProcurementItems.reduce((accumulator, current) => accumulator + Number(current.totalPrice || 0), 0)
    return acc + currentRevenue
  }, 0)

  const currentMonthItems = currentMonthRequests.reduce((acc, curr) => acc + curr.ProcurementItems.length, 0)

  // Previous month data
  const previousMonthUsers = await prisma.Profile.count({
    where: {
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  })

  const previousMonthRequests = await prisma.ProcurementRequest.findMany({
    where: {
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
    include: {
      ProcurementItems: true,
    },
  })

  const previousMonthRevenue = previousMonthRequests.reduce((acc, curr) => {
    const currentRevenue = curr.ProcurementItems.reduce((accumulator, current) => accumulator + Number(current.totalPrice || 0), 0)
    return acc + currentRevenue
  }, 0)

  const previousMonthItems = previousMonthRequests.reduce((acc, curr) => acc + curr.ProcurementItems.length, 0)

  // Calculate changes
  const usersChange = previousMonthUsers === 0 ? 0 : ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100
  const revenueChange = previousMonthRevenue === 0 ? 0 : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
  const requestsChange = previousMonthRequests.length === 0 ? 0 : ((currentMonthRequests.length - previousMonthRequests.length) / previousMonthRequests.length) * 100
  const itemsChange = previousMonthItems === 0 ? 0 : ((currentMonthItems - previousMonthItems) / previousMonthItems) * 100

  const users = currentMonthUsers
  const requests = currentMonthRequests.length
  const totalRevenue = currentMonthRevenue
  const totalItems = currentMonthItems

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
                <span className="text-purple-600 font-bold">{usersChange >= 0 ? '+' : ''}{usersChange.toFixed(0)}</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Total revenue this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-600 font-bold">{revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(0)}</span> from last month
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
                <span className="text-purple-600 font-bold">{itemsChange >= 0 ? '+' : ''}{itemsChange.toFixed(0)}</span> from last month
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
