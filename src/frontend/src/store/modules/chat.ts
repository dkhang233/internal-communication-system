import { defineStore } from "pinia"
import { ref } from "vue"
import { getMessageForSpecificContactApi, readMessageApi, sendMessageApi } from "@/api/chat"
import { MessageResponse } from "@/api/chat/types/message"
import { getAllContactData } from "@/api/user"
import { useUserStore } from "./user"
import MessageStatus from "@/constants/message-status"
import MessageType from "@/constants/message-type"
import dayjs, { Dayjs } from "dayjs"

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
  sendedAt: Dayjs
  incoming: boolean
  status: MessageStatus
}

export const useChatStore = defineStore("chat", () => {
  const contacts = ref<Map<string, Contact>>(new Map())
  const conversations = ref<Map<string, MessageData[]>>(new Map())
  const currentChatUser = ref<string>("") // Email của liên hệ mà người dùng đang nhắn tin
  const hasNewMessage = ref<boolean>(false) // Cho biết có tin nhắn mới
  const showSendNewMessage = ref<boolean>(false)
  const loadingData = ref<boolean>(false)
  const showContacts = ref<boolean>(false) // Hiển thị contacts hay không đối với Mobile
  const uploadProgress = ref<Map<string, number>>(new Map())

  const getContacts = async function () {
    loadingData.value = true
    contacts.value.clear()
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

      contacts.value.set(contact.email, contact)

      // Lấy tin nhắn tương ứng với contact vừa lưu
      getMessageForSpecificContactApi(contact.email, 0).then(function ({ data }) {
        data.reverse().forEach((msg) => {
          let res: MessageData = {
            id: msg.id,
            type: msg.type,
            content: msg.content,
            sendedAt: dayjs(msg.sendedAt),
            incoming: msg.sender !== useUserStore().email ? true : false,
            status: msg.status
          }

          // Lưu message
          addMessage(contact.email, res)
        })
      })
    })

    useChatStore().loadingData = false
    hasNewMessage.value = true
  }

  const addMessage = (contactId: string, msg: MessageData) => {
    let msgs = conversations.value.get(contactId) || []
    // Nếu tin nhắn thêm vào khác ngày so với tin nhắn phía trước thì thêm timeline
    if (dayjs(msg.sendedAt).isAfter(msgs.at(-1)?.sendedAt || dayjs("1970-01-01"), "day")) {
      msgs.push({
        id: -1,
        type: MessageType.TIMELINE,
        content: dayjs(msg.sendedAt).format("DD/MM/YYYY"),
        sendedAt: dayjs(),
        incoming: false,
        status: MessageStatus.SUCCESS
      })
    }

    // Lưu tin nhắn vào store
    msgs.push(msg)
    conversations.value.set(contactId, msgs)

    // Cập nhập số lượng tin nhắn chưa đọc nếu cần
    msg.status === MessageStatus.SUCCESS && msg.incoming === true && contacts.value.get(contactId)!.unreadMessage++
  }

  const sendMessage = async (msg: MessageData) => {
    let currentContact = contacts.value.get(currentChatUser.value)

    // Kiểm tra liên hệ hiện tại, nếu không tồn tại => không thực hiện gửi tin nhắn
    if (!currentContact) return

    // Thay đổi từ liên hệ mới => liên hệ cũ
    currentContact!.isNewContact = false

    // Lấy mảng messages tương ứng với liên hệ
    let msgs = conversations.value.get(currentChatUser.value) || []

    // Nếu tin nhắn mới khác ngày với tin nhắn trước đó => thêm timeline
    if (dayjs(msg.sendedAt).isAfter(msgs.at(-1)?.sendedAt || dayjs("1970-01-01"), "day")) {
      msgs.push({
        id: -1,
        type: MessageType.TIMELINE,
        content: dayjs(msg.sendedAt).format("DD/MM/YYYY"),
        sendedAt: dayjs(),
        incoming: false,
        status: MessageStatus.SUCCESS
      })
    }

    // Đẩy message vào store
    let idx = msgs.push(msg)
    conversations.value.set(currentChatUser.value, msgs)
    hasNewMessage.value = true

    // Tạo request data
    let messageRequest: MessageResponse = {
      id: -1,
      sender: useUserStore().email,
      recipient: currentChatUser.value,
      type: msg.type,
      content: msg.content,
      sendedAt: dayjs(),
      status: msg.status
    }

    // Đưa liên hệ mà người dùng vừa nhắn tin lên đầu danh sách liên hệ
    contacts.value.delete(currentChatUser.value)
    contacts.value.set(currentChatUser.value, currentContact)

    // Gửi tin nhắn đến server
    const { data } = await sendMessageApi(messageRequest)

    // Cập nhật trạng thái tin nhắn
    let res: MessageData = {
      id: data.id,
      type: data.type,
      content: data.content,
      sendedAt: data.sendedAt,
      incoming: false,
      status: data?.status || MessageStatus.FAILED
    }

    conversations.value.get(currentChatUser.value)?.splice(idx - 1, 1, res)
  }

  // Xử lí khi người dùng đọc tin nhắn
  const readMessage = (contactId: string) => {
    if (contacts.value.get(contactId)?.unreadMessage) {
      let messageId = conversations.value.get(contactId)?.at(-1)?.id || -2
      let unreadMessage = contacts.value.get(contactId)!.unreadMessage
      readMessageApi(contactId, messageId, unreadMessage).then(() => {
        contacts.value.get(contactId)!.unreadMessage = 0
      })
    }
  }

  const updateUploadProgress = (name: string, process: number) => {
    console.log(process)
    setTimeout(() => uploadProgress.value.set(name, process), 500)
  }

  return {
    contacts,
    conversations,
    currentChatUser,
    uploadProgress,
    hasNewMessage,
    loadingData,
    showContacts,
    getContacts,
    sendMessage,
    showSendNewMessage,
    readMessage,
    addMessage,
    updateUploadProgress
  }
})
