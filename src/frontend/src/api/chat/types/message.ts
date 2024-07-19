export enum MessageType {
  TEXT = 0,
  LINK = 1
}

export interface MessageResponse {
  id?: number
  sender: string
  recipient: string
  type: MessageType
  content: string
  sendedAt: Date
}

export type MessageResponseData = ApiResponseData<MessageResponse[]>
