"use server"

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function approveRequest(req) {
    const user = await currentUser();
    const clerkId = user.id
    const dbUser = await prisma.User.findUnique({
        where: { clerkId }
    })

    try {
        if (dbUser.role === "STOREKEEPER" && req.stage === "STA_EMPLOYEE") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: {
                    stage: "STA_STOREKEEPER",
                }
            })
        }

        else if (dbUser.role === "DEPARTMENT_HEAD" && req.stage === "STA_STOREKEEPER") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: {
                    stage: "STA_DEPARTMENT_HEAD",
                }
            })
            console.log('HOD')
        }

        else if (dbUser.role === "LOGISTICS_OFFICER" && req.stage === "STA_DEPARTMENT_HEAD") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: {
                    stage: "STA_LOGISTICS_OFFICER",
                }
            })
        }

        else if (dbUser.role === "SUPPLIER" && req.stage === "STA_LOGISTICS_OFFICER") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: {
                    stage: "STA_SUPPLIER",
                }
            })
        }

        else if (dbUser.role === "INVENTORY_ASSET_MANAGER" && req.stage === "STA_SUPPLIER") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: {
                    stage: "STA_INVENTORY_ASSET_MANAGER",
                }
            })
        }

        else if (dbUser.role === "FINANCE_OFFICER" && req.stage === "STA_INVENTORY_ASSET_MANAGER") {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: {
                    stage: "STA_FINANCE_OFFICER",
                }
            })
        }


        return { success: true }

    } catch (error) {
        console.log("Erro: ", error.message)
        return { success: false }
    }
}