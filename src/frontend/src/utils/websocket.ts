import { Stomp } from "@stomp/stompjs"
import { getEmail, getToken } from "./cache/cookies"
import SockJS from "sockjs-client"
import { handleMessageStatus, handleReceiveMessage } from "@/websocket/chat"
import { handleRoomCreated, handleRoomDestroyed } from "@/websocket/meet"
import { ElMessage } from "element-plus"
import { handleReceiveUserStatus } from "@/websocket/user"

interface WebsocketRequest {
  destination: string
  body: string
  isBinaryData: boolean
  binaryData?: Uint8Array
}

const stompClient = Stomp.over(function () {
  return new SockJS(import.meta.env.VITE_WEBSOCKET_PATH)
})

stompClient.reconnect_delay = 5000

const connectCallback = (frame: any) => {
  stompClient.subscribe("/topic/room/created", handleRoomCreated)
  stompClient.subscribe("/topic/room/destroyed", handleRoomDestroyed)
  stompClient.subscribe(`/user/${getEmail()}/queue/receiveMsg`, handleReceiveMessage)
  stompClient.subscribe(`/user/${getEmail()}/queue/updateMsgStatus`, handleMessageStatus)
  stompClient.subscribe("/topic/user/status", handleReceiveUserStatus)
}

// Handle Websocket Error
stompClient.onWebSocketError = (error) => {
  console.error("Error with websocket: ", error)
}

// Handle Stomp Error
stompClient.onStompError = (frame) => {
  console.error("Broker reported error: " + frame)
}

// connect to Websocket Server
const connectWS = () => {
  stompClient.connected ||
    !getToken() ||
    stompClient.connect(
      {
        Authorization: getToken()
      },
      connectCallback
    )
}

// disconnect websocket
const disconnectWS = () => {
  stompClient.disconnect()
}

export { connectWS, disconnectWS }
