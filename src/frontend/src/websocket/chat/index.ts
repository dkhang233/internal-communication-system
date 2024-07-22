import { MessageResponse } from "@/api/chat/types/message"
import { getContactData } from "@/api/login"
import { Contact, handleSendedAt, useChatStore } from "@/store/modules/chat"
import { IMessage } from "@stomp/stompjs"

const handleReceiveMessage = (message: IMessage): void => {
  let msg: MessageResponse = JSON.parse(message.body)
  if (!useChatStore().conversations.has(msg.sender)) {
    getContactData(msg.sender).then(({ data }) => {
      console.log(data)
      let contact: Contact = {
        email: data[0].contactId,
        name: data[0].contactUsername,
        online: data[0].status ? true : false,
        show: true
      }
      useChatStore().contacts.unshift(contact)
    })
  } else {
    let index = useChatStore().contacts.findIndex((c) => c.email === msg.sender)
    let contact: Contact = useChatStore().contacts.splice(index, 1)[0]
    useChatStore().contacts.unshift(contact)
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

export { handleReceiveMessage }
