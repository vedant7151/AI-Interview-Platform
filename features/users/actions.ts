"use server"

import { db } from "@/drizzle/db"
import { eq } from "drizzle-orm"
import { Users } from "@/drizzle/schema/user"
import { currentUser } from "@clerk/nextjs/server"
import { upsertUser } from "./db"

export async function getUser(id: string) {
    try {
        if (!id) return null;

        const user = await db.query.Users.findFirst({
            where: eq(Users.id, id)
        })

        if (!user) return null;
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Error in getUser Server Action:", error);
        // Never throw to the client during polling; treat failures as "not ready yet".
        return null;
    }
}

export async function ensureUser() {
    try {
        let u = await currentUser()
        if (!u) {
            const { getCurrentUser } = await import("@/services/clerk/lib/getCurrentUser")
            const { clerkClient } = await import("@clerk/nextjs/server")
            const { userId } = await getCurrentUser()
            if (!userId) return null
            const client = await clerkClient()
            u = await client.users.getUser(userId)
        }
        if (!u) return null

        const primaryEmail =
            u.emailAddresses?.find(e => e.id === u.primaryEmailAddressId)?.emailAddress ??
            u.primaryEmailAddress?.emailAddress ??
            u.emailAddresses?.[0]?.emailAddress

        if (!primaryEmail) return null

        const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || primaryEmail

        await upsertUser({
            id: u.id,
            email: primaryEmail,
            name,
            image: u.imageUrl ?? "",
        })

        return { ok: true }
    } catch (error: any) {
        console.error("Error in ensureUser Server Action:", error)
        return null
    }
}