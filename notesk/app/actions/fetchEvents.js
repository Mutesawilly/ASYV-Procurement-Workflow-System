"use server"

import { prisma } from "@/lib/prisma"
import { createServerClient } from '@supabase/ssr'
import { cookies } from "next/headers"

export const fetchEvents = async () => {
  // Create Supabase server client
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
    },
  })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('fetchEvents: user', user)

  if (!user) {
    console.log('fetchEvents: no user, returning empty array')
    return [] // return empty array if user is not authenticated
  }

  // Ensure profile exists
  let profile = await prisma.Profile.findUnique({
    where: { id: user.id },
  });
  if (!profile) {
    profile = await prisma.Profile.create({
      data: {
        id: user.id,
        email: user.email,
        firstName: null,
        lastName: null,
        department: null,
      },
    });
  }

  // Fetch procurement requests for the current user, including items
  const requests = await prisma.ProcurementRequest.findMany({
    where: { requesterId: user.id, deleted: false },
    include: {
      ProcurementItems: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  console.log('fetchEvents: requests found', requests.length)

  // Transform to match eventSchema
  const events = requests.map((request) => {
    const totalAmount = request.ProcurementItems.reduce((sum, item) => sum + item.totalPrice, 0)
    return {
      id: request.id,
      title: request.title,
      type: request.stage.replace('STA_', '').toLowerCase(), // e.g., "employee" from "STA_EMPLOYEE"
      date: request.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      status: request.status.toLowerCase(),
      amount: `$${totalAmount.toFixed(2)}`,
      category: request.department,
    }
  })

  console.log('fetchEvents: events transformed', events.length)

  return events
}
