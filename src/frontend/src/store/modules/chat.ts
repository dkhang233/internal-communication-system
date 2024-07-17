import { defineStore } from "pinia"
import { ref } from "vue"
import { getContactData } from "@/api/login"

export enum MessageType {
  TEXT = "text",
  LINK = "link"
}

interface Contact {
  email: string
  name: string
  online: boolean
  messages: MessageData[]
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
  const contacts = ref<Contact[]>([])
  const currentChatUser = ref<string>("")

  const getContacts = async function () {
    const { data } = await getContactData()
    data.forEach((c) => {
      let contact: Contact = {
        email: c.contactId,
        name: c.contactUsername,
        online: c.status ? true : false,
        messages: []
      }
      contacts.value.push(contact)
    })
  }

  const hasNewMessage = ref<boolean>(false)
  return { contacts, currentChatUser, hasNewMessage, getContacts }
})

/**
 *  let message: MessageData = {
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
 */
