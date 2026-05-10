import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"
import { getUserIdTag } from "../users/dbCache"

export function getJobInfoGlobalTag() {
  return getGlobalTag("jobInfos")
}

export function getJobInfoUserTag(userId : string){
    return getUserTag(userId, "jobInfos")
}

export function getJobInfoIdTag(id : string){
    return getIdTag("jobInfos" , id)
}


export function revalidateJobInfoCache({
    id,
    userId
} : {
    id : string;
    userId : string
}){
    revalidateTag(getJobInfoGlobalTag(), "max")
    revalidateTag(getJobInfoUserTag(userId), "max")
    revalidateTag(getJobInfoIdTag(id), "max")
}