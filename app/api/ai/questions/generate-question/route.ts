import { db } from "@/drizzle/db"
import {
  JobInfoTable,
  questionDifficulties,
  QuestionsTable,
} from "@/drizzle/schema"
import { getJobInfoIdTag } from "@/features/jobinfos/dbCache"
import { insertQuestion } from "@/features/questions/db"
import { getQuestionJobInfoTag } from "@/features/questions/dbCache"
import { canCreateQuestion } from "@/features/questions/permission"
import { PLAN_LIMIT_MESSAGE } from "@/lib/errorToast"
import { generateAiQuestion } from "@/services/ai/questions"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"

import { and, asc, eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { createUIMessageStream, createUIMessageStreamResponse } from "ai"


import z from "zod"

const schema = z.object({
  prompt: z.enum(questionDifficulties),
  jobInfoId: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return new Response("Error generating your question", { status: 400 })
  }

  const { prompt: difficulty, jobInfoId } = result.data
  const { userId } = await getCurrentUser()

  if (userId == null) {
    return new Response("You are not logged in", { status: 401 })
  }

  if (!(await canCreateQuestion())) {

    console.log("Cannot create questions")
    return new Response(PLAN_LIMIT_MESSAGE, { status: 403 })
  }

  const jobInfo = await getJobInfo(jobInfoId, userId)
  if (jobInfo == null) {
    return new Response("You do not have permission to do this", {
      status: 403,
    })
  }

  const previousQuestions = await getQuestions(jobInfoId)

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      try {
        let savedQuestionId: string | null = null
        const res = generateAiQuestion({
          previousQuestions,
          jobInfo,
          difficulty,
          onFinish: async (question) => {
            console.log("Generated question:", question)
            const { id } = await insertQuestion({
              text: question,
              jobInfoId,
              difficulty,
            })
            savedQuestionId = id
            writer.write({
              type: "data-questionId",
              id: "question-id",
              data: { questionId: id },
            })
          },
        })

        console.log("AI response object:", res)
        writer.merge(res.toUIMessageStream())
      } catch (error) {
        console.error("Error generating question:", error)
      }
    },
  })

  return createUIMessageStreamResponse({ stream })
}



async function getQuestions(jobInfoId: string) {
  // No "use cache" here — unsafe in Route Handlers
  return db.query.QuestionsTable.findMany({
    where: eq(QuestionsTable.jobInfoId, jobInfoId),
    orderBy: asc(QuestionsTable.createdAt),
  })
}

async function getJobInfo(id: string, userId: string) {
  // No "use cache" here — unsafe in Route Handlers
  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  })
}