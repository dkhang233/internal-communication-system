import { IMessage, Stomp } from "@stomp/stompjs"
import { getToken } from "./cache/cookies"
import SockJS from "sockjs-client"
import { useMeetStore } from "@/store/modules/meet"
import { RoomResponse, Room } from "@/api/meet/types/room"

const headers = {
  Authorization: getToken()
}

const handleRoomResponse = (input: RoomResponse): Room => {
  return {
    id: input.id,
    name: input.name,
    participants: input.participants,
    createdAt: new Date(input.createdAt),
    destroyedAt: new Date(input.destroyedAt)
  }
}
const handleRoomCreated = function (messageOutput: IMessage) {
  const room: Room = handleRoomResponse(JSON.parse(messageOutput.body))
  useMeetStore().rooms.push(room)
}

const handleRoomDestroyed = function (messageOutput: IMessage) {
  const room: Room = handleRoomResponse(JSON.parse(messageOutput.body))
  useMeetStore().rooms.forEach((r) => {
    if (r.id === room.id) {
      r.destroyedAt = room.destroyedAt
    }
  })
}

const stompClient = Stomp.over(function () {
  return new SockJS(import.meta.env.VITE_WEBSOCKET_PATH)
})

stompClient.reconnect_delay = 5000

const connectCallback = (frame: any) => {
  console.log("Connected: " + frame)
  stompClient.subscribe("/topic/room/created", handleRoomCreated)
  stompClient.subscribe("/topic/room/destroyed", handleRoomDestroyed)
}

stompClient.onWebSocketError = (error) => {
  console.error("Error with websocket", error)
}

stompClient.onStompError = (frame) => {
  console.error("Broker reported error: " + frame.headers["message"])
  console.error("Additional details: " + frame.body)
}

export function connectWS() {
  stompClient.connect(headers, connectCallback)
}

export function disconnectWS() {
  stompClient.disconnect()
}

export function sendWS() {
  stompClient.publish({
    destination: "/topic/chat",
    body: "Hello world",
    headers: { priority: "9" }
  })
}
