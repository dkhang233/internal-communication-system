export interface MeetData {
  id: string
  name: string
  participants: Number
  createdAt: string
  destroyedAt: string
}

export type MeetResponseData = ApiResponseData<MeetData[]>
