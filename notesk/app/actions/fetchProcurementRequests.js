"use server"

import { prisma } from "@prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function fetchProcurementRequests() {
    // Create Supabase server client
    const supabase = createServerComponentClient({ cookies });
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return []; // return empty array if user is not authenticated
    }

    // Use supabaseId instead of clerkId in your Prisma User table
    const requests = await prisma.ProcurementRequest.findMany({
        where: { requesterId: user.id },
    });

    return requests;
}
