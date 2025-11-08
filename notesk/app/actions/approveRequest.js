"use server"

import { revalidatePath } from "next/cache"; 
import { prisma } from "@/lib/prisma"; // Assuming this is the correct path

import { createClient } from "@/lib/supabase/server";

export async function approveRequest(req) {
    // Create Supabase server client
    
    const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "User not authenticated" };
    }

    // Get the user from your database
    const dbUser = await prisma.Profile.findUnique({
        where: { id: user.id },
    });

    if (!dbUser) {
        return { success: false, message: "User not found in database" };
    }
    
    // Check if the request is already finished (optional but recommended)
    if (req.status === "APPROVED" || req.status === "REJECTED" || req.stage === "STA_COMPLETED") {
        return { success: false, message: `Request is already finalized (${req.status}).` };
    }

    let nextStage = null;
    let newStatus = "PENDING";
    let successMessage = "";

    try {
        // --- 1. Determine next stage and success message based on current role and stage ---
        
        // Employee -> Storekeeper (Implicit start, assuming a storekeeper handles first check)
        if (dbUser.role === "EMPLOYEE" && req.stage === "STA_EMPLOYEE") {
            nextStage = "STA_STOREKEEPER";
            successMessage = `Request ${req.id} approved by Storekeeper. Moving to Department Head.`;
        } 
        else if (dbUser.role === "STOREKEEPER" && req.stage === "STA_STOREKEEPER") {
            nextStage = "STA_DEPARTMENT_HEAD";
            successMessage = `Request ${req.id} approved by Storekeeper. Moving to Department Head.`;
        } 
        // Department Head approval
        else if (dbUser.role === "DEPARTMENT_HEAD" && req.stage === "STA_DEPARTMENT_HEAD") {
            nextStage = "STA_LOGISTICS_OFFICER";
            successMessage = `Request ${req.id} approved by Department Head. Moving to Logistics Officer.`;
        } 
        // Logistics Officer approval
        else if (dbUser.role === "LOGISTICS_OFFICER" && req.stage === "STA_LOGISTICS_OFFICER") {
            nextStage = "STA_SUPPLIER";
            successMessage = `Request ${req.id} approved by Logistics Officer. Moving to Supplier.`;
        } 
        // Supplier check/acceptance (This stage usually involves RFQ/PO generation)
        else if (dbUser.role === "SUPPLIER" && req.stage === "STA_SUPPLIER") {
            nextStage = "STA_INVENTORY_ASSET_MANAGER";
            successMessage = `Request ${req.id} confirmed by Supplier. Moving to Inventory Manager.`;
        } 
        // Inventory/Asset Manager check (Confirmation of assets/stock levels)
        else if (dbUser.role === "INVENTORY_ASSET_MANAGER" && req.stage === "STA_INVENTORY_ASSET_MANAGER") {
            nextStage = "STA_FINANCE_OFFICER";
            successMessage = `Request ${req.id} validated by Inventory/Asset Manager. Moving to Finance Officer.`;
        } 
        // FINAL APPROVAL: Finance Officer
        else if (dbUser.role === "FINANCE_OFFICER" && req.stage === "STA_FINANCE_OFFICER") {
            nextStage = "STA_COMPLETED"; // Final status stage
            newStatus = "APPROVED";      // Set final status
            successMessage = `Request ${req.id} approved by Finance Officer. Request is now **COMPLETED**.`;
        } else {
            return { success: false, message: `Unauthorized action. User role ${dbUser.role} cannot approve request in stage ${req.stage}.` };
        }

        // --- 2. Update the request in the database ---
        if (nextStage) {
            await prisma.ProcurementRequest.update({
                where: { id: req.id },
                data: { 
                    stage: nextStage,
                    status: newStatus, // Only changes to APPROVED at the final step, otherwise remains PENDING
                    // lastApprovedBy: user.id,
                    updatedAt: new Date(),
                },
            });
        }

        // --- 3. Revalidate the path ---
        // ⚠️ Update this to the actual path your request list/table is on
        revalidatePath("/protected/dashboard/requests"); 

        // --- 4. Return success message ---
        return { 
            success: true, 
            message: successMessage, 
            nextStage: nextStage,
            newStatus: newStatus
        };
    } catch (error) {
        console.error("Changing Stage Error: ", error);
        return { success: false, message: `Database update failed: ${error.message}` };
    }
}