export interface RoomResponse {
  id: string
  name: string
  participants: Number
  createdAt: string
  destroyedAt: string
}

export interface Room {
  id: string
  name: string
  participants: Number
  createdAt: Date
  destroyedAt: Date
}
export type RoomResponseData = ApiResponseData<RoomResponse[]>
export type MeetTokenData = ApiResponseData<string>
