'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function addUserDepartment(req) {
    // const user = auth();
    const cuser = await currentUser();
    const clerkId = cuser.id;
    // console.log("User", cuser.id)

    try {
        const userDepartAdded = await prisma.User.update({
            where: { clerkId },
            data: {
                department: req.department,
            }
        })

        return { success: true }
    } catch (error) {
        console.log("Error: ", error.message)
        return { success: false, error: error.message }
    }
}