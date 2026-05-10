type CacheTag = "users" | "jobInfos" | "interviews" | "questions"

export function getGlobalTag(tag: CacheTag) {
    return `user-global:${tag}` as const
}

export function getUserTag(userId: string, tag: CacheTag) {
    return `user:${userId}:${tag}` as const
}

export function getIdTag(tag: CacheTag, id: string) {
    return `${tag}:${id}` as const
}

export function getJobInfoTag(tag: CacheTag, jobInfoId: string) {
    return `user:${jobInfoId}:${tag}` as const
}