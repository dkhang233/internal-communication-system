import { getMeetDataApi } from "@/api/meet"
import { MeetData } from "@/api/meet/types/meet"
import { defineStore } from "pinia"
import { ref } from "vue"

export const userMeetStore = defineStore("meet", () => {
  const name = ref<string>("")
  const meetingWindow = ref()
  const setName = (meetName: string) => {
    name.value = meetName
  }
  const rooms = ref<MeetData[]>([])
  const getRooms = async () => {
    const { data } = await getMeetDataApi()
    rooms.value = data
  }
  return { name, meetingWindow, setName, getRooms, rooms }
})
