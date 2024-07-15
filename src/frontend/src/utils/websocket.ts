import { messageCallbackType, Stomp } from "@stomp/stompjs"
import { getToken } from "./cache/cookies"
import SockJS from "sockjs-client"

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

const headers = {
  Authorization: getToken()
}

const connectCallback = (frame: any) => {
  console.log("Connected: " + frame)
}

// Handle Websocket Error
stompClient.onWebSocketError = (error) => {
  console.error("Error with websocket: ", error)
}

// Handle Stomp Error
stompClient.onStompError = (frame) => {
  console.error("Broker reported error: " + frame.headers["message"])
  console.error("Additional details: " + frame.body)
}

// connect to Websocket Server
const connectWS = () => {
  stompClient.connect(headers, connectCallback)
}

// disconnect websocket
const disconnectWS = () => {
  stompClient.disconnect()
}

const sendWebsocketRequest = (request: WebsocketRequest) => {
  stompClient.publish({
    destination: request.destination,
    body: request?.body,
    binaryBody: request.binaryData,
    headers: {
      isBinaryData: request.isBinaryData + "",
      priority: "9"
    }
  })
}
// Subcribe to receive messages from specific broker
const subscribeBroker = (path: string, callback: messageCallbackType) => {
  stompClient.subscribe(path, callback)
}

export { connectWS, disconnectWS, sendWebsocketRequest, subscribeBroker }
