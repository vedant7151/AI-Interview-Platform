"use cache"
import { db } from "@/drizzle/db";
import { Users } from "@/drizzle/schema/user";
import { getUserIdTag } from "@/features/users/dbCache";
import { cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

export async function getUser(userId: string) {
    if (!userId) return null
    cacheTag(getUserIdTag(userId))

    try {
        return await db.query.Users.findFirst({
            where: eq(Users.id, userId)
        })
    } catch (e) {
        console.error("Error in services/clerk getUser:", e)
        return null
    }
}
