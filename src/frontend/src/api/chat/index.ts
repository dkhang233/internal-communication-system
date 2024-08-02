import { request } from "@/utils/service"
import { MessageResponse, MessageResponseData, SendMessageResponseData } from "./types/message"

export function getMessageForSpecificContactApi(contactId: string, page: number, quantity: number = 20) {
  return request<MessageResponseData>({
    url: "/messages/with",
    method: "get",
    params: { contactId, page, quantity }
  })
}

export function sendMessageApi(message: MessageResponse) {
  return request<SendMessageResponseData>({
    url: "/messages/send",
    method: "post",
    data: message
  })
}

export function readMessageApi(contactId: string, lastMessageId: number, quantity: number) {
  return request<string>({
    url: "/messages/read",
    method: "post",
    params: { contactId, lastMessageId, quantity }
  })
}
