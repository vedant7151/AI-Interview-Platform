/** Live socket messages (voice-react) or persisted chat events from `listChatEvents` (REST). */
export function condenseChatMessages(
  messages: unknown[]
): { isUser: boolean; content: string[] }[] {
  return messages.reduce(
    (acc: { isUser: boolean; content: string[] }[], message) => {
      const data = getMessageLine(message)
      if (data == null || data.content === "") {
        return acc
      }

      const lastMessage = acc.at(-1)
      if (lastMessage == null) {
        acc.push({ isUser: data.isUser, content: [data.content] })
        return acc
      }

      if (lastMessage.isUser === data.isUser) {
        lastMessage.content.push(data.content)
      } else {
        acc.push({ isUser: data.isUser, content: [data.content] })
      }

      return acc
    },
    [] as { isUser: boolean; content: string[] }[]
  )
}

function getMessageLine(
  message: unknown
): { isUser: boolean; content: string } | null {
  if (message == null || typeof message !== "object") return null
  const m = message as Record<string, unknown>
  const type = m.type

  // Hume REST `listChatEvents`: USER_MESSAGE / AGENT_MESSAGE + messageText
  if (type === "USER_MESSAGE") {
    const text = m.messageText
    if (typeof text !== "string") return null
    return { isUser: true, content: text }
  }
  if (type === "AGENT_MESSAGE") {
    const text = m.messageText
    if (typeof text !== "string") return null
    return { isUser: false, content: text }
  }

  // WebSocket / voice-react JSON messages
  if (type !== "user_message" && type !== "assistant_message") {
    return null
  }
  const inner = m.message as { content?: string } | undefined
  if (inner?.content == null) return null
  return {
    isUser: type === "user_message",
    content: inner.content,
  }
}