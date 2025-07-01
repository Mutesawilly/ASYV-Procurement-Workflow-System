
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {

    try {
        const evt = await verifyWebhook(req);

        // Do something with payload
        // For this guide, log payload to console
        const { id } = evt.data;
        const eventType = evt.type;
        console.log(
            `Received webhook with ID ${id} and event type of ${eventType}`
        );
        console.log("Webhook payload:", evt.data);


        // syncing the users from clerk into the database
        const user = evt.data

        if (evt.type === "user.created") {

            await prisma.User.create({
                data: {
                    clerkId: user?.id,
                    email: user?.email_addresses?.[0]?.email_address,
                    firstName: user?.first_name,
                    lastName: user?.last_name,
                }
            })
        }
        else if (evt.type === "user.updated") {
            await prisma.User.update({
                where: { clerkId: user.id },
                data: {
                    email: user?.email_addresses?.[0]?.email_address,
                    firstName: user?.first_name,
                    lastName: user?.last_name,
                }
            })
        }
        else if (evt.type === "user.deleted") {
            await prisma.User.delete({
                where: { clerkId: user.id }
            })
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("Webhook Error:", err.message)
        return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
    }
}
