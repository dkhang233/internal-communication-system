export interface MeetData {
  name: string
  participants: Number
  createdAt: string
  destroyedAt: string
}

export type MeetResponseData = ApiResponseData<MeetData[]>
