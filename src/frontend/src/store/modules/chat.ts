import { defineStore } from "pinia"
import { ref } from "vue"
import { getAllContactData } from "@/api/login"
import { getMessageForSpecificContactApi } from "@/api/chat"
import { MessageType } from "@/api/chat/types/message"

export interface Contact {
  email: string
  name: string
  online: boolean
  show: boolean
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
  const conversations = ref<Map<string, MessageData[]>>(new Map())
  const currentChatUser = ref<number>(0)
  const hasNewMessage = ref<boolean>(false)
  const showSendNewMessage = ref<boolean>(false)

  const getContacts = async function () {
    contacts.value = []
    conversations.value.clear()
    const { data } = await getAllContactData()
    data.forEach((c) => {
      let contact: Contact = {
        email: c.contactId,
        name: c.contactUsername,
        online: c.status ? true : false,
        show: true
      }
      contacts.value.push(contact)
      getMessageForSpecificContactApi(c.contactId).then(function ({ data }) {
        let msgs: MessageData[] = []
        data.forEach((msg) => {
          let res: MessageData = {
            type: msg.type,
            content: msg.content,
            sendedAt: handleSendedAt(new Date(msg.sendedAt)),
            incoming: msg.sender === contact.email ? true : false
          }
          msgs.push(res)
        })
        msgs.reverse()
        conversations.value.set(c.contactId, msgs)
      })
    })
    hasNewMessage.value = true
  }
  return { contacts, conversations, currentChatUser, hasNewMessage, getContacts, showSendNewMessage }
})
