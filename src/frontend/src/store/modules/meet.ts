import { getMeetDataApi, getMeetTokenApi } from "@/api/meet"
import { Room } from "@/api/meet/types/room"
import { defineStore } from "pinia"
import { ref } from "vue"
import { setMeetToken } from "@/utils/cache/cookies"

export const useMeetStore = defineStore("meet", () => {
  const name = ref<string>("")
  const newMeetingName = ref<string>("")
  const meetingWindow = ref()
  const setName = (meetName: string) => {
    name.value = meetName
  }
  const rooms = ref<Room[]>([])
  const getRooms = async () => {
    const { data } = await getMeetDataApi()
    data.forEach(({ id, name, participants, createdAt, destroyedAt }) => {
      let room: Room = {
        id: id,
        name: name,
        participants: participants,
        createdAt: new Date(createdAt) <= new Date() ? new Date(createdAt) : new Date(),
        destroyedAt: new Date(destroyedAt) <= new Date() ? new Date(destroyedAt) : new Date()
      }
      rooms.value.push(room)
    })
  }
  const getMeetToken = async () => {
    const { data } = await getMeetTokenApi()
    setMeetToken(data)
  }
  return { name, newMeetingName, meetingWindow, setName, getRooms, rooms, getMeetToken }
})
