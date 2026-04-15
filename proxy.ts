import arcjet, { detectBot, shield, slidingWindow } from '@arcjet/next'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/onboarding(.*)',
    '/sign-in(.*)',
    '/api/webhooks/clerk(.*)',
    '/api/ai/(.*)',  // ← add this
])


const aj =
    process.env.ARCJET_KEY
        ? arcjet({
            key: process.env.ARCJET_KEY,
            rules: [
                shield({ mode: "LIVE" }),
                detectBot({
                    mode: "LIVE",
                    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
                }),
                slidingWindow({
                    mode: "LIVE",
                    interval: "1m",
                    max: 100,
                }),
            ],
        })
        : null

export default clerkMiddleware(async (auth, req) => {
    // Server Actions require a very specific response shape; redirects/HTML here will
    // surface in the client as "unexpected response was received from the server".
    const isServerAction = req.headers.get("next-action") ?? req.headers.get("Next-Action")
    if (isServerAction) return

    const detection = aj ? await aj.protect(req) : null

    if (detection?.isDenied()) {
        return new Response("Access Denied", { status: 403 })
    }

    if (!isPublicRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}