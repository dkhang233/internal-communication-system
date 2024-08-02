import MessageStatus from "@/constants/message-status"
import MessageType from "@/constants/message-type"

export interface MessageResponse {
  id: number
  sender: string
  recipient: string
  type: MessageType
  content: string
  sendedAt: Date
  status: MessageStatus
}

export type MessageResponseData = ApiResponseData<MessageResponse[]>
export type SendMessageResponseData = ApiResponseData<MessageResponse>
