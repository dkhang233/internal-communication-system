import { useChatStore } from "@/store/modules/chat"
import { IMessage } from "@stomp/stompjs"

export const handleReceiveUserStatus = (message: IMessage): void => {
  let msg = JSON.parse(message.body)
  useChatStore().contacts.forEach((contact) => {
    if (contact.email === msg.email) {
      contact.online = msg.status ? true : false
    }
  })
}
