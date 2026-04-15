import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { upsertUser } from "@/features/users/db";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await getCurrentUser();
        if (!userId) return NextResponse.json({ error: "No user logged in" }, { status: 401 });

        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);

        const email = clerkUser.emailAddresses.find(
            e => e.id === clerkUser.primaryEmailAddressId
        )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

        await upsertUser({
            id: clerkUser.id,
            name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "Local Developer",
            email: email || "dev@example.com",
            image: clerkUser.imageUrl || "",
            createdAt: new Date(clerkUser.createdAt),
            updatedAt: new Date(clerkUser.updatedAt),
        });

        return NextResponse.json({ success: true, message: "User synced to local DB!" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
