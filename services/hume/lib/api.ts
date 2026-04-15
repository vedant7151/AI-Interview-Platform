import { env } from "@/data/env/server"
import { HumeClient } from "hume"
import { cacheTag } from "next/cache"
import { getInterviewIdTag } from "@/features/interviews/dbCache"

export async function fetchChatMessages(humeChatId: string, interviewId: string) {
  "use cache"
  cacheTag(getInterviewIdTag(interviewId))

  const client = new HumeClient({ apiKey: env.HUME_API_KEY })
  const allChatEvents: unknown[] = []

  const page = await client.empathicVoice.chats.listChatEvents(humeChatId, {
    pageNumber: 0,
    pageSize: 100,
  })

  // `Page` async-iterates all items and loads further pages via `hasNextPage` / `getNextPage`.
  for await (const chatEvent of page) {
    allChatEvents.push(chatEvent)
  }

  return allChatEvents
}