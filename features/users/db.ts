import { Users } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

export async function upsertUser(user: typeof Users.$inferInsert) {
    try {
        await db.insert(Users).values(user).onConflictDoUpdate({
            target: Users.id,
            set: user
        });
    } catch (error: any) {
        if (error.code === '23505' && error.constraint === 'users_email_unique') {
            await db.update(Users).set(user).where(eq(Users.email, user.email));
        } else {
            throw error;
        }
    }
}

export async function deleteUser(id: string) {
    await db.delete(Users).where(eq(Users.id, id))
}   