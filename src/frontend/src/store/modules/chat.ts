import { getAllMessagesApi } from "@/api/chat"
import { MessageResponse } from "@/api/chat/types/message"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useUserStore } from "./user"

export enum MessageType {
  TEXT = "text",
  LINK = "link"
}

interface Contact {
  name: string
  online: boolean
}

export interface MessageData {
  type: MessageType
  content: string
  sendedAt: string
  incoming: boolean
}

export const handleSendedAt = (input: Date): string => {
  return `${input.getHours().toLocaleString().padStart(2, "0")}:${input.getMinutes().toLocaleString().padStart(2, "0")}`
}

export const useChatStore = defineStore("chat", () => {
  const contacts = ref<Map<string, Contact>>(new Map<string, Contact>())
  const conversations = ref<Map<string, MessageData[]>>(new Map<string, MessageData[]>())
  const currentChatUser = ref<string>("")
  const getAllMessages = async function () {
    conversations.value.clear()
    const { data } = await getAllMessagesApi()
    data.forEach((msg) => {
      let message: MessageData = {
        type: MessageType.TEXT,
        content: msg.content,
        sendedAt: handleSendedAt(new Date(msg.sendedAt)),
        incoming: true
      }
      if (useUserStore().email === msg.sender) {
        message.incoming = false
        let messages: MessageData[] = conversations.value.get(msg.recipient) || []
        messages.push(message)
        conversations.value.set(msg.recipient, messages)

        if (!contacts.value.has(msg.recipient)) {
          let contact: Contact = {
            name: msg.recipientUsername,
            online: true
          }
          contacts.value.set(msg.recipient, contact)
        }
      } else {
        message.incoming = true
        let messages: MessageData[] = conversations.value.get(msg.sender) || []
        messages.push(message)
        conversations.value.set(msg.sender, messages)

        if (!contacts.value.has(msg.sender)) {
          let contact: Contact = {
            name: msg.senderUsername,
            online: true
          }
          contacts.value.set(msg.sender, contact)
        }
      }
    })
    currentChatUser.value = contacts.value.keys().next().value
  }

  const hasNewMessage = ref<boolean>(false)
  return { contacts, currentChatUser, conversations, hasNewMessage, getAllMessages }
})
