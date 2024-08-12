import MessageStatus from "@/constants/message-status"
import MessageType from "@/constants/message-type"
import { Dayjs } from "dayjs"

export interface MessageResponse {
  id: number
  sender: string
  recipient: string
  type: MessageType
  content: string
  sendedAt: Dayjs
  status: MessageStatus
}

export type MessageResponseData = ApiResponseData<MessageResponse[]>
export type SendMessageResponseData = ApiResponseData<MessageResponse>
