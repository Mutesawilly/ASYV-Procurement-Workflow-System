'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { currentUser } from "@clerk/nextjs/server"

export async function addRequest(req) {
    const cuser = await currentUser();
    if (!cuser) throw new Error("Not authenticated");

    // 2. Fetch user from DB to get department
    const dbUser = await prisma.user.findUnique({
        where: { clerkId: cuser.id },
    });
    if (!dbUser) throw new Error("User not found in DB");

    const requestStatus = [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "CANCELLED",
        "COMPLETED",
        "ERROR",
    ]

    try {
        const savedProcurementRequest = await prisma.ProcurementRequest.create({
            data: {
            ...req,
            department: dbUser.department
            }
        })
        if (Array.isArray(req.items)) {
            console.log(req.items)
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

        // passing the request to the storekeeper
        const storekeeperUser = await prisma.User.findFirst({
            where: {
                role: "STOREKEEPER"
            }
        })

        if (storekeeperUser) {
            const storeKeeperRequest = await prisma.ApprovalStep.create({
                data: {
                    procurementRequestId: savedProcurementRequest.id,
                    approverId: storekeeperUser.id
                }
            })
            if (storekeeperUser && storeKeeperRequest.status === "APPROVED")
                await prisma.ApprovalStep.update({
                    // UPDATING THE EMPLOYEE REQUEST TO APPROVED
                })
        }

        // passing the request to the head of the department
        const HOD = await prisma.User.findFirst({
            where: {
                role: "HODDEPARTMENT_HEAD"
            }
        })

        if (HOD && storekeeperUser.status === "APPROVED") {
            const HODRequest = await prisma.ApprovalStep.create({
                where: {
                    department,
                    data: {
                        procurementRequestId: savedProcurementRequest.id,
                        approverId: storekeeperUser.id
                    }
                }
            })
        }

        // passing to the head of the department
        const logistics = await prisma.User.findFirst({
            where: {
                role: "OGISTICS_OFFICER"
            }
        })

        // passing to the head of the department
        const invetory = await prisma.User.findFirst({
            where: {
                role: "INVENTORY_ASSET_MANAGER"
            }
        })

        // passing to the head of the department
        const finance = await prisma.User.findFirst({
            where: {
                role: "FINANCE_OFFICER"
            }
        })

        // passing to the head of the department
        const supplier = await prisma.User.findFirst({
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