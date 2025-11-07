'use server'

import { prisma } from "@/lib/prisma"
// ⚠️ Supabase-specific import for Server Components/Actions

import { createClient } from "@/lib/supabase/server";

export async function addRequest(req) {
    // 1. Get the authenticated user's ID from Supabase
    const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();

    // Replaced Clerk's currentUser() check
    if (!user) throw new Error("Not authenticated");

    // The user ID from Supabase is typically in user.id
    const supabaseUserId = user.id;

    // 2. Fetch user from DB to get department
    const dbUser = await prisma.Profile.findUnique({
        // Replaced clerkId with Supabase's user.id, assuming your DB schema uses 'supabaseId' or similar
        // If your User model uses 'id' as the unique identifier for the Supabase user ID, use 'id'
        where: { id: supabaseUserId }, // ⚠️ Adjust 'supabaseId' to match your Prisma schema field name
    });
    if (!dbUser) throw new Error("User not found in DB");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const requestStatus = [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "CANCELLED",
        "COMPLETED",
        "ERROR",
    ]

    try {
        // console.log("req data", req)
        const savedProcurementRequest = await prisma.ProcurementRequest.create({
            data: {
                ...req,
                department: dbUser?.department || "EMPLOYEES",
                
                requester: {
                    connect: { id: supabaseUserId } 
                },
            }
        })
        if (Array.isArray(req.items)) {
            // console.log(req.items)
            for (const item of req.items) {
                await prisma.ProcurementItem.create({
                    data: {
                        procurementRequestId: savedProcurementRequest.id,
                        name: item.name,
                        description: item.description,
                        quantity: parseInt(item.quantity, 10),
                        unitPrice: parseInt(item.unitPrice, 10),
                        totalPrice: parseInt(item.totalPrice, 10),
                    }
                });
            }
        }

        // The rest of your logic remains the same as it interacts with Prisma, not the auth provider.

        // passing the request to the storekeeper
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const storekeeperUser = await prisma.profile.findFirst({
            where: {
                role: "STOREKEEPER"
            }
        })

        // ... (omitted commented-out blocks for brevity, but they are in the full code)

        // passing to the head of the department
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const logistics = await prisma.profile.findFirst({
            where: {
                role: "LOGISTICS_OFFICER"
            }
        })

        // passing to the head of the department
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const invetory = await prisma.profile.findFirst({
            where: {
                role: "INVENTORY_ASSET_MANAGER"
            }
        })

        // passing to the head of the department
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const finance = await prisma.profile.findFirst({
            where: {
                role: "FINANCE_OFFICER"
            }
        })

        // passing to the head of the department
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const supplier = await prisma.profile.findFirst({
            where: {
                role: "SUPPLIER"
            }
        })


        // fetch store kee per user
        // create approval step with storekeeper user id as approver

        // console.log("Request submited", req)
        return { "success": true }
    } catch (err) {
        console.log("Error: ", err.message)
        return { error: err.message }
    }
}

export default addRequest;