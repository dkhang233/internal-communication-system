import { defineStore } from "pinia"
import { ref } from "vue"
import { getMessageForSpecificContactApi, readMessageApi, sendMessageApi } from "@/api/chat"
import { MessageResponse } from "@/api/chat/types/message"
import { getAllContactData } from "@/api/user"
import { useUserStore } from "./user"
import MessageStatus from "@/constants/message-status"
import MessageType from "@/constants/message-type"
import dayjs from "dayjs"

export interface Contact {
  email: string
  name: string
  online: boolean
  unreadMessage: number
  avatar: string
  isNewContact?: boolean
  show?: boolean
}

export interface MessageData {
  id: number
  type: MessageType
  content: string
  sendedAt: Date
  incoming: boolean
  status: MessageStatus
}

export const useChatStore = defineStore("chat", () => {
  const contacts = ref<Contact[]>([])
  const conversations = ref<Map<string, MessageData[]>>(new Map())
  const currentChatUser = ref<number>(0)
  const currentChatEmail = ref<string>("")
  const hasNewMessage = ref<boolean>(false)
  const showSendNewMessage = ref<boolean>(false)
  const loadingData = ref<boolean>(false)
  const showContacts = ref<boolean>(false) // Hiển thị contacts hay không đối với Mobile

  const getContacts = async function () {
    loadingData.value = true
    contacts.value = []
    conversations.value.clear()
    const { data } = await getAllContactData()
    data.forEach((c) => {
      // Tạo liên hệ tương ứng với thông tin từ response và dẩy vào danh sách liên hệ
      let contact: Contact = {
        email: c.contactId,
        name: c.contactUsername,
        unreadMessage: 0,
        avatar: c.avatar,
        online: c.status ? true : false,
        show: true
      }

      // Khởi tạo liên hệ đang nhắn tin ban đầu là liên hệ đầu tiên trong danh sách
      if (!contacts.value.length) {
        currentChatUser.value = 0
        currentChatEmail.value = c.contactId
      }

      contacts.value.push(contact)

      // Lấy tin nhắn tương ứng với contact vừa đẩy vào
      getMessageForSpecificContactApi(contact.email, 0).then(function ({ data }) {
        let msgs: MessageData[] = []
        data.reverse().forEach((msg) => {
          let res: MessageData = {
            id: msg.id,
            type: msg.type,
            content: msg.content,
            sendedAt: new Date(msg.sendedAt),
            incoming: msg.sender !== useUserStore().email ? true : false,
            status: msg.status
          }

          // Nếu tin nhắn thêm vào khác ngày so với tin nhắn phía trước thì thêm timeline
          if (dayjs(msg.sendedAt).isAfter(msgs.at(-1)?.sendedAt || dayjs("1970-01-01"), "day")) {
            msgs.push({
              id: -1,
              type: MessageType.TIMELINE,
              content: dayjs(msg.sendedAt).format("DD/MM/YYYY"),
              sendedAt: new Date(),
              incoming: false,
              status: MessageStatus.SUCCESS
            })
          }

          msgs.push(res) // Đẩy tin nhắn vào
          res.status === MessageStatus.SUCCESS && res.incoming === true && contact.unreadMessage++ // Nếu tin nhắn ở trạng thái thành công => tăng số lượng tin nhắn chưa đọc tương ứng với liên hệ lên 1
        })
        conversations.value.set(contact.email, msgs)
        contacts.value.at(0)!.unreadMessage > 0 && readMessage() // Nếu liên hệ đang nhắn tin ban đầu có tin nhắn chưa đọc => cập nhập trạng thái đọc tin nhắn
      })
    })

    useChatStore().loadingData = false
    hasNewMessage.value = true
  }

  const sendMessage = async (msg: MessageData) => {
    // Kiểm tra liên hệ hiện tại, nếu không tồn tại => không thực hiện gửi tin nhắn
    if (!contacts.value[currentChatUser.value]) return

    // Thay đổi từ liên hệ mới => liên hệ cũ
    let currentContact = contacts.value[currentChatUser.value]
    currentContact.isNewContact = false

    // Đẩy message vào store
    let msgs = conversations.value.get(currentContact.email) || []

    // Nếu tin nhắn mới khác ngày với tin nhắn trước đó => thêm timeline
    if (dayjs(msg.sendedAt).isAfter(msgs.at(-1)?.sendedAt || dayjs("1970-01-01"), "day")) {
      msgs.push({
        id: -1,
        type: MessageType.TIMELINE,
        content: dayjs(msg.sendedAt).format("DD/MM/YYYY"),
        sendedAt: new Date(),
        incoming: false,
        status: MessageStatus.SUCCESS
      })
    }

    let idx = msgs.push(msg)
    conversations.value.set(currentContact.email, msgs)
    hasNewMessage.value = true

    // Tạo request data
    let messageRequest: MessageResponse = {
      id: -1,
      sender: useUserStore().email,
      recipient: currentContact.email,
      type: msg.type,
      content: msg.content,
      sendedAt: new Date(),
      status: msg.status
    }

    // Đưa liên hệ mà người dùng vừa nhắn tin lên đầu danh sách liên hệ
    let index = contacts.value.findIndex((c) => c.email === messageRequest.recipient)
    let contact: Contact = contacts.value.splice(index, 1)[0]
    contacts.value.unshift(contact)
    currentChatUser.value = 0
    currentChatEmail.value = contact.email

    // Gửi tin nhắn đến server
    const { data } = await sendMessageApi(messageRequest)
    let res: MessageData = {
      id: data.id,
      type: data.type,
      content: data.content,
      sendedAt: new Date(data.sendedAt),
      incoming: false,
      status: data?.status || MessageStatus.FAILED // Cập nhật trạng thái tin nhắn
    }

    conversations.value.get(currentContact.email)?.splice(idx - 1, 1, res)
  }

  // Xử lí khi người dùng đọc tin nhắn
  const readMessage = () => {
    if (contacts.value.at(currentChatUser.value)?.unreadMessage) {
      let messageId = conversations.value.get(currentChatEmail.value)?.at(-1)?.id || -2
      let unreadMessage = contacts.value.at(currentChatUser.value)!.unreadMessage
      readMessageApi(currentChatEmail.value, messageId, unreadMessage).then(() => {
        contacts.value.at(currentChatUser.value)!.unreadMessage = 0
      })
    }
  }

  return {
    contacts,
    conversations,
    currentChatUser,
    currentChatEmail,
    hasNewMessage,
    loadingData,
    showContacts,
    getContacts,
    sendMessage,
    showSendNewMessage,
    readMessage
  }
})
