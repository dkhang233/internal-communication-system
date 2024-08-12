import { getContactData } from "@/api/user"
import MessageStatus from "@/constants/message-status"
import MessageType from "@/constants/message-type"
import { Contact, MessageData, useChatStore } from "@/store/modules/chat"
import { IMessage } from "@stomp/stompjs"
import dayjs, { Dayjs } from "dayjs"

export interface WSMessageResponse {
  id: number
  sender: string
  recipient: string
  type: MessageType
  content: string
  sendedAt: Dayjs
  status: MessageStatus
}

const handleReceiveMessage = (message: IMessage): void => {
  let msg: WSMessageResponse = JSON.parse(message.body)
  if (!useChatStore().conversations.has(msg.sender)) {
    // Thêm liên hệ mới nếu chưa có
    getContactData(msg.sender).then(({ data }) => {
      console.log(data)
      let contact: Contact = {
        email: data[0].contactId,
        name: data[0].contactUsername,
        online: data[0].status ? true : false,
        avatar: data[0].avatar,
        unreadMessage: 1,
        show: true
      }
      useChatStore().contacts.set(contact.email, contact)
    })
  } else {
    // Nếu đã tồn tại liên hệ thì đưa lên đầu danh sách
    let contact = useChatStore().contacts.get(msg.sender)
    useChatStore().contacts.delete(msg.sender)
    if (contact) useChatStore().contacts.set(msg.sender, contact)
  }

  let result: MessageData = {
    id: msg.id,
    type: msg.type,
    content: msg.content,
    sendedAt: dayjs(msg.sendedAt),
    incoming: true,
    status: MessageStatus.SUCCESS
  }

  useChatStore().addMessage(msg.sender, result)

  // Cập nhật trạng thái đọc tin nhắn nếu là liên hệ đang nhắn tin
  if (msg.sender === useChatStore().currentChatUser) {
    useChatStore().readMessage(msg.sender)
  }
}

type MessageStatusResponse = {
  contactId: string
  lastMessageId: number
  quantity: number
}

// Xử lý trạng thái tin nhắn
const handleMessageStatus = (message: IMessage): void => {
  let status: MessageStatusResponse = JSON.parse(message.body)

  let check = 0
  useChatStore()
    .conversations.get(status.contactId)
    ?.forEach((msg) => {
      if (msg.id === status.lastMessageId) {
        msg.status = MessageStatus.READ
        check++
      }

      if (check > 0 && check <= status.quantity) {
        msg.status = MessageStatus.READ
      }
    })
}
export { handleReceiveMessage, handleMessageStatus }
