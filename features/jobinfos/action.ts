"use server"

import z from "zod"
import { jobInfoSchema } from "./schema"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { db } from "@/drizzle/db"
import { and, eq } from "drizzle-orm"
import { JobInfoTable } from "@/drizzle/schema"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getJobInfoIdTag } from "./dbCache"
import { insertJobInfo, updateJobInfo as updateJobInfoDB } from "./db"

export async function createJobInfo(unsafeData: z.infer<typeof jobInfoSchema>) {
  const userContext = await getCurrentUser()
  const userId = userContext.userId
  if (userId == null) {
    return {
      error: true,
      message: "You don't have permission to do this create",
    }
  }

  console.log("DEBUG: userId is", userId, "type:", typeof userId)

  const { success, data } = jobInfoSchema.safeParse(unsafeData)
  if (!success) {
    return {
      error: true,
      message: "Invalid job data",
    }
  }

  const jobInfoData = {
    name: data.name,
    title: data.title ?? null,
    experienceLevel: data.experienceLevel,
    description: data.description,
    userId: userId,
  }

  console.log("DEBUG jobInfoData before insert:", jobInfoData);

  const jobInfo = await insertJobInfo(jobInfoData)

  return { error: false as const, data: jobInfo }
}

export async function updateJobInfo(
  id: string,
  unsafeData: z.infer<typeof jobInfoSchema>
) {
  const userContext = await getCurrentUser()
  const userId = userContext.userId
  if (userId == null) {
    console.log("DEBUG update: userId is null");
    return {
      error: true,
      message: "You don't have permission to do this (userId null)",
    }
  }

  const { success, data } = jobInfoSchema.safeParse(unsafeData)
  if (!success) {
    return {
      error: true,
      message: "Invalid job data",
    }
  }

  const existingJobInfo = await getJobInfo(id, userId)
  if (existingJobInfo == null) {
    console.log("DEBUG update: existingJobInfo is null for id", id, "userId", userId);
    return {
      error: true,
      message: "You don't have permission to update this job info (not found)",
    }
  }

  const updateData = {
    name: data.name,
    title: data.title ?? null,
    experienceLevel: data.experienceLevel,
    description: data.description,
  }

  const jobInfo = await updateJobInfoDB(id, updateData)

  return { error: false as const, data: jobInfo }
}

async function getJobInfo(id: string, userId: string) {
  "use cache"
  cacheTag(getJobInfoIdTag(id))

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  })
}