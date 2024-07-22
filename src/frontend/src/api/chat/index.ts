import { request } from "@/utils/service"
import { MessageResponse, MessageResponseData } from "./types/message"

export function getMessageForSpecificContactApi(contactId: string) {
  return request<MessageResponseData>({
    url: "chats/messages/contact",
    method: "get",
    params: { contactId }
  })
}

export function sendMessageApi(message: MessageResponse) {
  return request<MessageResponse>({
    url: "chats/messages/send",
    method: "post",
    data: message
  })
}
