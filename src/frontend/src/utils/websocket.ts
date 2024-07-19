import { Stomp } from "@stomp/stompjs"
import { getEmail, getToken } from "./cache/cookies"
import SockJS from "sockjs-client"
import { handleReceiveMessage } from "@/websocket/chat"
import { handleRoomCreated, handleRoomDestroyed } from "@/websocket/meet"
import { ElMessage } from "element-plus"

interface WebsocketRequest {
  destination: string
  body: string
  isBinaryData: boolean
  binaryData?: Uint8Array
  // headers: { priority: "9" }
}

const stompClient = Stomp.over(function () {
  return new SockJS(import.meta.env.VITE_WEBSOCKET_PATH)
})

stompClient.reconnect_delay = 5000

const token = getToken()
const headers = {
  Authorization: token
}

const connectCallback = (frame: any) => {
  stompClient.subscribe("/topic/room/created", handleRoomCreated)
  stompClient.subscribe("/topic/room/destroyed", handleRoomDestroyed)
  stompClient.subscribe(`/user/${getEmail()}/queue/receiveMsg`, handleReceiveMessage)
}

// Handle Websocket Error
stompClient.onWebSocketError = (error) => {
  ElMessage.error("Error with websocket: ", error)
}

// Handle Stomp Error
stompClient.onStompError = (frame) => {
  ElMessage.error("Broker reported error: " + frame.headers["message"])
  ElMessage.error("Additional details: " + frame.body)
}

// connect to Websocket Server
const connectWS = () => {
  stompClient.connected || token === undefined || stompClient.connect(headers, connectCallback)
}

// disconnect websocket
const disconnectWS = () => {
  stompClient.disconnect()
}

const sendWebsocketRequest = (request: WebsocketRequest) => {
  stompClient.publish({
    destination: request.destination,
    body: request?.body
  })
  console.log(request.body)
}

export { connectWS, disconnectWS, sendWebsocketRequest }
