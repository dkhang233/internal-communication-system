import { Room, RoomResponse } from "@/api/meet/types/room"
import { useMeetStore } from "@/store/modules/meet"
import { IMessage } from "@stomp/stompjs"

const handleRoomCreated = (messageOutput: IMessage) => {
  const room: Room = handleRoomResponse(JSON.parse(messageOutput.body))
  useMeetStore().rooms.push(room)
}

// Handle room destroyed data
const handleRoomDestroyed = (messageOutput: IMessage) => {
  const room: Room = handleRoomResponse(JSON.parse(messageOutput.body))
  useMeetStore().rooms.forEach((r) => {
    if (r.id === room.id) {
      r.destroyedAt = room.destroyedAt
    }
  })
}

// Convert RoomResponse to Room
const handleRoomResponse = (input: RoomResponse): Room => {
  return {
    id: input.id,
    name: input.name,
    participants: input.participants,
    createdAt: new Date(input.createdAt),
    destroyedAt: new Date(input.destroyedAt)
  }
}

export { handleRoomCreated, handleRoomDestroyed }
