export interface MessageResponse {
  id: number
  sender: string
  recipient: string
  type: string
  content: string
  sendedAt: Date
  senderUsername: string
  recipientUsername: string
}

export type MessageResponseData = ApiResponseData<MessageResponse[]>
