import { deleteUser, upsertUser } from "@/features/users/db";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const event = await verifyWebhook(req);

        switch (event.type) {
            case "user.created":
            case "user.updated": {
                const clerkData = event.data;

                const email =
                    clerkData.email_addresses.find(
                        e => e.id === clerkData.primary_email_address_id
                    )?.email_address;

                if (!email) {
                    return new NextResponse("No primary email found", { status: 400 });
                }

                await upsertUser({
                    id: clerkData.id,
                    name: [clerkData.first_name, clerkData.last_name].filter(Boolean).join(" "),
                    email,
                    image: clerkData.image_url,
                    createdAt: new Date(clerkData.created_at),
                    updatedAt: new Date(clerkData.updated_at),
                });

                break;
            }

            case "user.deleted": {
                if (!event.data.id) {
                    return new NextResponse("No user id found", { status: 400 });
                }
                await deleteUser(event.data.id);
                break;
            }
        }

        return new NextResponse("Webhook received", { status: 200 });
    } catch (err) {
        console.error(err);
        return new NextResponse("Invalid webhook", { status: 400 });
    }
}