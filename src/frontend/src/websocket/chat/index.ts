import { MessageResponse } from "@/api/chat/types/message"
import { getContactData } from "@/api/login"
import { Contact, handleSendedAt, MessageData, useChatStore } from "@/store/modules/chat"
import { sendWebsocketRequest } from "@/utils/websocket"
import { IMessage } from "@stomp/stompjs"

const sendMessagePath = "/app/sendMsg"

const handleReceiveMessage = (message: IMessage): void => {
  let msg: MessageResponse = JSON.parse(message.body)
  if (!useChatStore().conversations.has(msg.sender)) {
    getContactData(msg.sender).then(({ data }) => {
      let contact: Contact = {
        email: data[0].contactId,
        name: data[0].contactUsername,
        online: data[0].status ? true : false
      }
      useChatStore().contacts.push(contact)
    })
  }
  let msgs = useChatStore().conversations.get(msg.sender) || []
  msgs.push({
    type: msg.type,
    content: msg.content,
    sendedAt: handleSendedAt(new Date(msg.sendedAt)),
    incoming: true
  })
  useChatStore().conversations.set(msg.sender, msgs)
  useChatStore().hasNewMessage = true
}

const sendMessage = (msg: MessageResponse) => {
  sendWebsocketRequest({
    destination: sendMessagePath,
    body: JSON.stringify(msg),
    isBinaryData: false
  })
}

export { sendMessage, handleReceiveMessage }
