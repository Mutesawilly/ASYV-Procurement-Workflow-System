"use server"

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchProcurementRequests() {
    const user = currentUser();
    const clerkId = user?.id;

    const requests = await prisma.ProcurementRequest.findMany({
        where: { requesterId: clerkId }
    });

    return requests
}