import { defineStore } from "pinia"
import { ref } from "vue"
import { getMessageForSpecificContactApi, sendMessageApi } from "@/api/chat"
import { MessageResponse } from "@/api/chat/types/message"
import { getAllContactData } from "@/api/user"
import { useUserStore } from "./user"
import MessageStatus from "@/constants/message-status"
import MessageType from "@/constants/message-type"

export interface Contact {
  email: string
  name: string
  online: boolean
  isNewContact?: boolean
  show?: boolean
}

export interface MessageData {
  type: MessageType
  content: string
  sendedAt: string
  incoming: boolean
  status: MessageStatus
}

export const handleSendedAt = (input: Date): string => {
  return `${input.getHours().toLocaleString().padStart(2, "0")}:${input.getMinutes().toLocaleString().padStart(2, "0")}`
}

export const useChatStore = defineStore("chat", () => {
  const contacts = ref<Contact[]>([])
  const conversations = ref<Map<string, MessageData[]>>(new Map())
  const currentChatUser = ref<number>(0)
  const currentChatUserName = ref<string>("")
  const hasNewMessage = ref<boolean>(false)
  const showSendNewMessage = ref<boolean>(false)
  const loadingData = ref<boolean>(false)

  const getContacts = async function () {
    loadingData.value = true
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
      getMessageForSpecificContactApi(c.contactId, 0).then(function ({ data }) {
        let msgs: MessageData[] = []
        data.reverse().forEach((msg) => {
          let res: MessageData = {
            type: msg.type,
            content: msg.content,
            sendedAt: handleSendedAt(new Date(msg.sendedAt)),
            incoming: msg.sender === contact.email ? true : false,
            status: msg.status
          }
          msgs.push(res)
        })
        conversations.value.set(c.contactId, msgs)
        useChatStore().loadingData = false
      })
    })
    hasNewMessage.value = true
  }

  const sendMessage = (msg: MessageData) => {
    // Thay đổi từ liên hệ mới => liên hệ cũ
    let currentContact = contacts.value[currentChatUser.value]
    currentContact.isNewContact = false

    // Đẩy message vào store
    let msgs = conversations.value.get(currentContact.email) || []
    msgs.push(msg)
    console.log(msgs)
    conversations.value.set(currentContact.email, msgs)
    hasNewMessage.value = true

    // Gửi tin nhắn đến server
    let messageRequest: MessageResponse = {
      sender: useUserStore().email,
      recipient: currentContact.email,
      type: msg.type,
      content: msg.content,
      sendedAt: new Date(),
      status: msg.status
    }
    sendMessageApi(messageRequest)
      .then(function () {
        msgs.pop()
        msg.status = MessageStatus.SUCCESS
        msg.sendedAt = handleSendedAt(new Date())
        msgs.push(msg)
      })
      .catch(function () {
        msgs.pop()
        msg.status = MessageStatus.FAILED
        msgs.push(msg)
      })

    // Đưa liên hệ mà người dùng vừa nhắn tin lên đầu danh sách liên hệ
    let index = useChatStore().contacts.findIndex((c) => c.email === messageRequest.recipient)
    let contact: Contact = useChatStore().contacts.splice(index, 1)[0]
    useChatStore().contacts.unshift(contact)
    useChatStore().currentChatUser = 0
  }
  return {
    contacts,
    conversations,
    currentChatUser,
    currentChatUserName,
    hasNewMessage,
    loadingData,
    getContacts,
    sendMessage,
    showSendNewMessage
  }
})
