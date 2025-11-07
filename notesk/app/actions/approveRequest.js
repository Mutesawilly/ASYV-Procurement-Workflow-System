"use server"

import { prisma } from "@prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function approveRequest(req) {
    // Create Supabase server client
    const supabase = createServerComponentClient({ cookies });
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "User not authenticated" };
    }

    // Get the user from your database
    const dbUser = await prisma.User.findUnique({
        where: { supabaseId: user.id }, // assuming you replaced clerkId with supabaseId
    });

    if (!dbUser) {
        return { success: false, message: "User not found in database" };
    }

    try {
        if (dbUser.role === "STOREKEEPER" && req.stage === "STA_EMPLOYEE") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: { stage: "STA_STOREKEEPER" },
            });
        } else if (dbUser.role === "DEPARTMENT_HEAD" && req.stage === "STA_STOREKEEPER") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: { stage: "STA_DEPARTMENT_HEAD" },
            });
        } else if (dbUser.role === "LOGISTICS_OFFICER" && req.stage === "STA_DEPARTMENT_HEAD") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: { stage: "STA_LOGISTICS_OFFICER" },
            });
        } else if (dbUser.role === "SUPPLIER" && req.stage === "STA_LOGISTICS_OFFICER") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: { stage: "STA_SUPPLIER" },
            });
        } else if (dbUser.role === "INVENTORY_ASSET_MANAGER" && req.stage === "STA_SUPPLIER") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: { stage: "STA_INVENTORY_ASSET_MANAGER" },
            });
        } else if (dbUser.role === "FINANCE_OFFICER" && req.stage === "STA_INVENTORY_ASSET_MANAGER") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: { stage: "STA_FINANCE_OFFICER" },
            });
        }

        return { success: true };
    } catch (error) {
        console.log("Error: ", error.message);
        return { success: false };
    }
}
