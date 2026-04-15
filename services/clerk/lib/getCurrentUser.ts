import { auth } from "@clerk/nextjs/server";
import { verifyToken } from "@clerk/backend";
import { cookies } from "next/headers";
import { getUser } from "./getUser";

export async function getCurrentUser({ allData = false } = {}) {
    const { userId: authUserId, redirectToSignIn } = await auth()

    let userId = authUserId

    // Fallback for server actions: proxy.ts returns early for server actions,
    // causing auth() to return null. Verify the session cookie directly instead.
    if (userId == null) {
        try {
            const cookieStore = await cookies()
            const token = cookieStore.get('__session')?.value
            if (token) {
                const verified = await verifyToken(token, {
                    secretKey: process.env.CLERK_SECRET_KEY!,
                })
                userId = verified.sub
            }
        } catch {
            // Token verification failed, userId remains null
        }
    }

    return {
        userId,
        redirectToSignIn,
        user: allData && userId != null ? await getUser(userId) : undefined
    }
}