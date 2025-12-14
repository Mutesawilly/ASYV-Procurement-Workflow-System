"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export const fetchUserProfile = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  })

  return profile
}
