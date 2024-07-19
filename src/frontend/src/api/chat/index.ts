import { request } from "@/utils/service"
import { MessageResponseData } from "./types/message"

export function getMessageForSpecificContactApi(contactId: string) {
  return request<MessageResponseData>({
    url: "chats/messages/contact",
    method: "get",
    params: { contactId }
  })
}
