"use server"

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getDatabaseUser() {
    const user = await currentUser();
    const clerkId = user.id
    const dbUser = await prisma.User.findUnique({
        where: { clerkId }
    })
    return { data: dbUser}
}