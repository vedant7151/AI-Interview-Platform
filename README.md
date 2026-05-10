# Landr - Interview AI Platform

A modern interview preparation and coaching application built with Next.js, Clerk auth, AI-powered feedback, and serverless database support.

---

## 🚀 What this app does

- Secure user authentication and onboarding with **Clerk**
- Job posting and interview flow management
- AI-generated interview questions and feedback
- Real-time voice-driven interview sessions using **Hume**
- Server-side data persistence with **Neon** and **Drizzle ORM**
- Route protection and bot shielding with **Arcjet**
- Built for deployment on **Vercel** with Next.js App Router

---

## ✨ Key features

- **User onboarding and authentication** with Clerk
- **Create and manage job info** records
- **Organize interviews** under job postings
- **Generate interviewer questions** using Google AI
- **Generate structured interview feedback** from interview transcripts
- **Hume voice session integration** for richer mock interview experiences
- **Automatic cache invalidation** using Next.js tags
- **Protected API routes** and webhook handling for Clerk events

---

## 🧰 Tech stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript + React 19
- **Authentication:** Clerk
- **AI / LLM:** Google Generative AI (`@ai-sdk/google`, `ai`)
- **Voice / transcript:** Hume AI
- **Database:** Neon serverless Postgres with Drizzle ORM
- **Styling:** Tailwind CSS 4 + Radix UI + Shadcn components
- **Caching:** Next.js `cacheTag` + `revalidateTag`
- **Security:** Arcjet bot protection + protected routes middleware
- **Deployment:** Vercel-ready

---

## 🏗️ Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Production build

```bash
npm run build
```

This project was validated successfully with a full Next.js production build.

---

## 📦 Environment variables

Create a `.env` file or configure these values in Vercel:

```env
DATABASE_URL=
ARCJET_KEY=
CLERK_SECRET_KEY=
HUME_API_KEY=
HUME_SECRET_KEY=
GEMINI_API_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_HUM_CONFIG_ID=
```

---

## 🚀 Deploy on Vercel

Deploy directly with Vercel for the best performance and compatibility.

1. Connect your GitHub repo to Vercel
2. Set the environment variables above
3. Run the default build command: `npm run build`
4. Vercel will handle Next.js production deployment automatically

---

## 📄 Project structure highlights

- `app/` - Next.js App Router pages and server components
- `services/` - API integration helpers for Clerk, AI, and Hume
- `features/` - domain logic for users, job infos, interviews, and questions
- `drizzle/` - database schema and connection definitions
- `data/env/` - runtime environment validation with `@t3-oss/env-nextjs`

---

## 💡 Notes for recruiters

This codebase demonstrates a production-ready experience with modern full-stack patterns, secure auth, AI integration, voice session support, and serverless deployment readiness.
