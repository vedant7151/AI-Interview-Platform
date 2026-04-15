"use client"
import { useChat } from "@ai-sdk/react"

import { BackLink } from "@/components/BackLink";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { JobInfoTable, questionDifficulties, QuestionDifficulty } from "@/drizzle/schema";
import { formatQuestionDifficulty } from "@/features/questions/formatters";
import { useMemo, useState } from "react";
import { useCompletion } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { errorToast } from "@/lib/errorToast";
import z from "zod"


type Status = "awaiting-answer" | "awaiting-difficulty" | "init"
export function NewQuestionClientPage({
  jobInfo,
}: {
  jobInfo: Pick<typeof JobInfoTable.$inferSelect, "id" | "name" | "title">
}) {
  const [status, setStatus] = useState<Status>("init")
  const [answer, setAnswer] = useState<string | null>(null)

  const chatTransport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/questions/generate-question",
        prepareSendMessagesRequest: ({ messages, body }) => {
          const lastUser = [...messages].reverse().find((m) => m.role === "user")
          const textPart = lastUser?.parts?.find(
            (p): p is { type: "text"; text: string } => p.type === "text"
          )
          const prompt = textPart?.text
          const jobInfoId = body?.jobInfoId
          if (typeof prompt !== "string" || typeof jobInfoId !== "string") {
            throw new Error("Missing prompt or jobInfoId")
          }
          return {
            body: {
              prompt,
              jobInfoId,
            },
          }
        },
      }),
    []
  )

  const {
    sendMessage: generateQuestion,
    messages,
    setMessages,
    status: chatStatus,
  } = useChat({
    transport: chatTransport,
    onFinish: () => {
      setStatus("awaiting-answer")
    },
    onError: (error) => {
      errorToast(error.message || "Something went wrong")
    },
  })



  const {
    complete: generateFeedback,
    completion: feedback,
    setCompletion: setFeedback,
    isLoading: isGeneratingFeedback,
  } = useCompletion({
    api: "/api/ai/questions/generate-feedback",
    streamProtocol: "text",
    onFinish: () => {
      setStatus("awaiting-difficulty")
    },
    onError: error => {
      errorToast(error.message)
    },
  })


  const question = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m.role !== "assistant") continue
      const text = m.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("")
      if (text.trim()) return text
    }
    return null
  }, [messages])

  const questionId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m.role !== "assistant") continue
      for (let j = m.parts.length - 1; j >= 0; j--) {
        const part = m.parts[j]
        const parsed = z
          .object({
            type: z.literal("data-questionId"),
            data: z.object({ questionId: z.string() }),
          })
          .safeParse(part)
        if (parsed.success) return parsed.data.data.questionId
      }
    }
    return null
  }, [messages])

  return (
    <div className="flex flex-col items-center gap-4 w-full mx-w-[2000px] mx-auto flex-grow h-screen-header">
      <div className="container flex gap-4 mt-4 items-center justify-between">
        <div className="flex-grow basis-0">
          <BackLink href={`/app/job-infos/${jobInfo.id}`}>
            {jobInfo.name}
          </BackLink>
        </div>
        <Controls
          reset={() => {
            setStatus("init")
            setMessages([])
            setFeedback("")
            setAnswer(null)
          }}
          disableAnswerButton={
            answer == null || answer.trim() === "" || questionId == null
          }
          status={status}
          isLoading={
            isGeneratingFeedback ||
            chatStatus === "submitted" ||
            chatStatus === "streaming"
          }
          generateFeedback={() => {
            if (answer == null || answer.trim() === "" || questionId == null)
              return

            generateFeedback(answer?.trim(), {
              body: {
                questionId: questionId,
                jobInfoId: jobInfo.id
              }
            })
          }}
          generateQuestion={difficulty => {
            setMessages([])
            setFeedback("")
            setAnswer(null)
            generateQuestion(
              { text: difficulty },
              { body: { jobInfoId: jobInfo.id } }
            )
          }}
        />
        <div className="flex-grow hidden md:block" />
      </div>
      <QuestionContainer
        question={question}
        feedback={feedback}
        answer={answer}
        status={status}
        setAnswer={setAnswer}
      />
    </div>
  )
}


function QuestionContainer({
  question,
  feedback,
  answer,
  status,
  setAnswer,
}: {
  question: string | null
  feedback: string | null
  answer: string | null
  status: Status
  setAnswer: (value: string) => void
}) {
  return (
    // direction="horizontal"
    <ResizablePanelGroup className="flex-grow border-t">
      <ResizablePanel id="question-and-feedback" defaultSize={50} minSize={5}>
        {/* direction="vertical" */}
        <ResizablePanelGroup className="flex-grow">
          <ResizablePanel id="question" defaultSize={25} minSize={5}>
            <ScrollArea className="h-full min-w-48 *:h-full">
              {status === "init" && question == null ? (
                <p className="text-base md:text-lg flex items-center justify-center h-full p-6">
                  Get started by selecting a question difficulty above.
                </p>
              ) : (
                question && (
                  <MarkdownRenderer className="p-6">
                    {question}
                  </MarkdownRenderer>
                )
              )}
            </ScrollArea>
          </ResizablePanel>
          {feedback && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel id="feedback" defaultSize={75} minSize={5}>
                <ScrollArea className="h-full min-w-48 *:h-full">
                  <MarkdownRenderer className="p-6">
                    {feedback}
                  </MarkdownRenderer>
                </ScrollArea>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="answer" defaultSize={50} minSize={5}>
        <ScrollArea className="h-full min-w-48 *:h-full">
          <Textarea
            disabled={status !== "awaiting-answer"}
            onChange={e => setAnswer(e.target.value)}
            value={answer ?? ""}
            placeholder="Type your answer here..."
            className="w-full h-full resize-none border-none rounded-none focus-visible:ring focus-visible:ring-inset !text-base p-6"
          />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}


function Controls({
  status,
  isLoading,
  disableAnswerButton,
  generateQuestion,
  generateFeedback,
  reset,
}: {
  disableAnswerButton: boolean
  status: Status
  isLoading: boolean
  generateQuestion: (difficulty: QuestionDifficulty) => void
  generateFeedback: () => void
  reset: () => void
}) {
  return (
    <div className="flex gap-2">
      {status === "awaiting-answer" ? (
        <>
          <Button
            onClick={reset}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <LoadingSwap isLoading={isLoading}>Skip</LoadingSwap>
          </Button>
          <Button
            onClick={generateFeedback}
            disabled={disableAnswerButton}
            size="sm"
          >
            <LoadingSwap isLoading={isLoading}>Answer</LoadingSwap>
          </Button>
        </>
      ) : (
        questionDifficulties.map(difficulty => (
          <Button
            key={difficulty}
            size="sm"
            disabled={isLoading}
            onClick={() => generateQuestion(difficulty)}
          >
            <LoadingSwap isLoading={isLoading}>
              {formatQuestionDifficulty(difficulty)}
            </LoadingSwap>
          </Button>
        ))
      )}
    </div>
  )
}