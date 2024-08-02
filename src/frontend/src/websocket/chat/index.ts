import { MessageResponse } from "@/api/chat/types/message"
import { getContactData } from "@/api/user"
import MessageType from "@/constants/message-type"
import { Contact, MessageData, useChatStore } from "@/store/modules/chat"
import { IMessage } from "@stomp/stompjs"
import dayjs from "dayjs"

const handleReceiveMessage = (message: IMessage): void => {
  let msg: MessageResponse = JSON.parse(message.body)

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
      useChatStore().contacts.unshift(contact)
    })
  } else {
    // Nếu đã tồn tại liên hệ thì đưa lên đầu danh sách
    let index = useChatStore().contacts.findIndex((c) => c.email === msg.sender)
    let contact: Contact = useChatStore().contacts.splice(index, 1)[0]

    contact.unreadMessage++ // Tăng số lượng tin  nhắn lên 1
    useChatStore().contacts.unshift(contact)
    // Nếu liên hệ là người đang nhắn tin hiện tại, cập nhập trạng thái đọc tin nhắn
    if (msg.sender === useChatStore().currentChatEmail) {
      useChatStore().readMessage()
    }
  }

  // Thêm message mới
  let msgs = useChatStore().conversations.get(msg.sender) || []

  let res: MessageData = {
    id: msg.id,
    type: msg.type,
    content: msg.content,
    sendedAt: new Date(msg.sendedAt),
    incoming: true,
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
      status: "SUCCESS"
    })
  }

  msgs.push(res)

  useChatStore().conversations.set(msg.sender, msgs)
  useChatStore().hasNewMessage = true
}

type MessageStatus = {
  contactId: string
  lastMessageId: number
  quantity: number
}

// Xử lý trạng thái tin nhắn
const handleMessageStatus = (message: IMessage): void => {
  let status: MessageStatus = JSON.parse(message.body)

  let check = 0
  useChatStore()
    .conversations.get(status.contactId)
    ?.forEach((msg) => {
      if (msg.id === status.lastMessageId) {
        msg.status = "READ"
        check++
      }

      if (check > 0 && check <= status.quantity) {
        msg.status = "READ"
      }
    })
}
export { handleReceiveMessage, handleMessageStatus }
