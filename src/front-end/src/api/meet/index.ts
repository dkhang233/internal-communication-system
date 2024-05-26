import { request } from "@/utils/service"
import { MeetResponseData } from "./types/meet"

export function getMeetDataApi() {
  return request<MeetResponseData>({
    url: "meets/allrooms",
    method: "get"
  })
}
