import { Users } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

export async function upsertUser(user: typeof Users.$inferInsert) {
    await db.insert(Users).values(user).onConflictDoUpdate({
        target: Users.id,
        set: user
    })
}

export async function deleteUser(id: string) {
    await db.delete(Users).where(eq(Users.id, id))
}   