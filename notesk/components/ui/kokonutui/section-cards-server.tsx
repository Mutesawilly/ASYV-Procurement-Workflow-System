import { prisma } from "@/lib/prisma"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

type CardData = {
  id: string
  title: string
  value: string
  subtitle?: string
  percentage?: number | null
}

export default async function getSectionCardsData() {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user')

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile) throw new Error('No profile')

  const userRole = profile.role

  const roleToStage: Record<string, string> = {
    EMPLOYEE: 'STA_EMPLOYEE',
    STOREKEEPER: 'STA_STOREKEEPER',
    DEPARTMENT_HEAD: 'STA_DEPARTMENT_HEAD',
    LOGISTICS_OFFICER: 'STA_LOGISTICS_OFFICER',
    SUPPLIER: 'STA_SUPPLIER',
    INVENTORY_ASSET_MANAGER: 'STA_INVENTORY_ASSET_MANAGER',
    FINANCE_OFFICER: 'STA_FINANCE_OFFICER',
    ADMIN: 'STA_EMPLOYEE', // Admin sees all from employee onward
  }

  const stages = [
    'STA_EMPLOYEE',
    'STA_STOREKEEPER',
    'STA_DEPARTMENT_HEAD',
    'STA_LOGISTICS_OFFICER',
    'STA_SUPPLIER',
    'STA_INVENTORY_ASSET_MANAGER',
    'STA_FINANCE_OFFICER'
  ]

  const userStage = roleToStage[userRole]
  const stageIndex = stages.indexOf(userStage)
  const allowedStages = stages.slice(stageIndex)

  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const allRequests = await prisma.procurementRequest.findMany({
    where: {
      stage: { in: allowedStages },
      ...(userRole !== 'ADMIN' ? { requesterId: user.id } : {}),
    },
    include: { ProcurementItems: true },
  })

  const currentMonthRequests = allRequests.filter(r => r.createdAt >= currentMonthStart && r.createdAt <= currentMonthEnd)
  const previousMonthRequests = allRequests.filter(r => r.createdAt >= previousMonthStart && r.createdAt <= previousMonthEnd)

  const totalRequests = currentMonthRequests.length
  const totalAmount = currentMonthRequests.reduce((acc, r) => {
    const itemsTotal = (r.ProcurementItems || []).reduce(
      (s, it) => s + Number(it.totalPrice ?? 0),
      0
    )
    return acc + itemsTotal
  }, 0)

  const byStatus = currentMonthRequests.reduce(
    (acc, r) => {
      const s = String(r.status ?? "").toLowerCase()
      const amount = (r.ProcurementItems || []).reduce(
        (s, it) => s + Number(it.totalPrice ?? 0),
        0
      )
      if (s.includes("pend")) {
        acc.pending += 1
        acc.pendingAmount += amount
      }
      else if (s.includes("progress") || s.includes("in_progress")) {
        acc.inProgress += 1
        acc.inProgressAmount += amount
      }
      else if (s.includes("complete")) {
        acc.completed += 1
        acc.completedAmount += amount
      }
      else {
        acc.other += 1
        acc.otherAmount += amount
      }
      return acc
    },
    { pending: 0, pendingAmount: 0, inProgress: 0, inProgressAmount: 0, completed: 0, completedAmount: 0, other: 0, otherAmount: 0 }
  )

  // Calculate previous month data

  const previousByStatus = previousMonthRequests.reduce(
    (acc, r) => {
      const s = String(r.status ?? "").toLowerCase()
      const amount = (r.ProcurementItems || []).reduce(
        (s, it) => s + Number(it.totalPrice ?? 0),
        0
      )
      if (s.includes("pend")) {
        acc.pending += 1
        acc.pendingAmount += amount
      }
      else if (s.includes("progress") || s.includes("in_progress")) {
        acc.inProgress += 1
        acc.inProgressAmount += amount
      }
      else if (s.includes("complete")) {
        acc.completed += 1
        acc.completedAmount += amount
      }
      else {
        acc.other += 1
        acc.otherAmount += amount
      }
      return acc
    },
    { pending: 0, pendingAmount: 0, inProgress: 0, inProgressAmount: 0, completed: 0, completedAmount: 0, other: 0, otherAmount: 0 }
  )

  const previousTotalAmount = previousMonthRequests.reduce((acc, r) => {
    const itemsTotal = (r.ProcurementItems || []).reduce(
      (s, it) => s + Number(it.totalPrice ?? 0),
      0
    )
    return acc + itemsTotal
  }, 0)

  // Calculate percentages as month-to-month comparisons
  const totalRequestsPercentage = previousMonthRequests.length === 0 ? 0 : ((currentMonthRequests.length - previousMonthRequests.length) / previousMonthRequests.length) * 100
  const totalAmountPercentage = previousTotalAmount === 0 ? 0 : ((totalAmount - previousTotalAmount) / previousTotalAmount) * 100
  const pendingPercentage = previousByStatus.pending === 0 ? 0 : ((byStatus.pending - previousByStatus.pending) / previousByStatus.pending) * 100
  const completedPercentage = previousByStatus.completed === 0 ? 0 : ((byStatus.completed - previousByStatus.completed) / previousByStatus.completed) * 100

  const cards: CardData[] = [
    {
      id: "total",
      title: "Total Requests",
      value: String(totalRequests),
      subtitle: "Requests this month",
      percentage: totalRequestsPercentage,
    },
    {
      id: "totalAmount",
      title: "Total Amount",
      value: `$${totalAmount.toFixed(2)}`,
      subtitle: "Total value this month",
      percentage: totalAmountPercentage,
    },
    {
      id: "pending",
      title: "Pending",
      value: String(byStatus.pending),
      subtitle: "Awaiting approval this month",
      percentage: pendingPercentage,
    },
    {
      id: "completed",
      title: "Completed",
      value: String(byStatus.completed),
      subtitle: "Fulfilled this month",
      percentage: completedPercentage,
    },
  ]

  return cards
}
