"use client"

import { Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter()

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      router.replace("/app")
    }, 2000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [router])

  return <Loader2Icon className="animate-spin size-24" />
}