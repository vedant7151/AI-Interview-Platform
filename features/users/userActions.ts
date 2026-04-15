"use server"
import { revalidateTag } from "next/cache";
import { getUserGlobalTag, getUserIdTag } from "./dbCache";

export async function revalidateUserCache(id: string) {
    revalidateTag(getUserGlobalTag(), "global")
    revalidateTag(getUserIdTag(id), "user")
}
