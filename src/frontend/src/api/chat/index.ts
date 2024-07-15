import { request } from "@/utils/service"
import { MessageResponseData } from "./types/message"

export function getAllMessagesApi() {
  return request<MessageResponseData>({
    url: "chats/messages",
    method: "get"
  })
}
