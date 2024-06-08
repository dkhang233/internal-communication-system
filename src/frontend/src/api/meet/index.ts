import { request } from "@/utils/service"
import { MeetTokenData, RoomResponseData } from "./types/room"

export function getMeetDataApi() {
  return request<RoomResponseData>({
    url: "meets/allrooms",
    method: "get"
  })
}

export function getMeetTokenApi() {
  return request<MeetTokenData>({
    url: "meets/token",
    method: "post"
  })
}
