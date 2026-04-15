const { loadEnvConfig } = require('@next/env')
loadEnvConfig(process.cwd())

import { db } from "@/drizzle/db";
import { Users } from "@/drizzle/schema/user";

async function main() {
    try {
        console.log("Seeding dummy user to satisfy foreign key constraint...");
        await db.insert(Users).values({
            id: "user_3BTvGJl2D6MjOY2YqQTTeecv67T",
            name: "Vedant Gada",
            email: "developer@example.com",
            image: "",
            createdAt: new Date(),
            updatedAt: new Date()
        }).onConflictDoNothing();
        console.log("Successfully seeded user!");
    } catch (e) {
        console.error("Failed:", e);
    }
}
main().then(() => process.exit(0));
