import { defineStore } from "pinia"
import { ref } from "vue"

export enum MessageType {
  TEXT = "text",
  LINK = "link"
}

interface Contact {
  name: string
  online: boolean
  newestMessage: Message
}

export interface Message {
  type: MessageType
  content: string
  sendedAt: string
  incoming: boolean
}

interface Conversation {
  name: string
  messages: Message[]
}

export const handleSendedAt = (input: Date): string => {
  return `${input.getHours().toLocaleString().padStart(2, "0")}:${input.getMinutes().toLocaleString().padStart(2, "0")}`
}

export const useChatStore = defineStore("chat", () => {
  const contacts = ref<Contact[]>([
    {
      name: "Khang",
      online: true,
      newestMessage: {
        type: MessageType.TEXT,
        content: "Chào ngày mới. Hôm nay là một ngày tuyệt vời. Hãy cùng chia sẻ một câu chuyện",
        sendedAt: handleSendedAt(new Date()),
        incoming: true
      }
    },
    {
      name: "Minh",
      online: true,
      newestMessage: {
        type: MessageType.TEXT,
        content: "",
        sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
        incoming: false
      }
    },
    {
      name: "Tom",
      online: false,
      newestMessage: {
        type: MessageType.TEXT,
        content: "",
        sendedAt: handleSendedAt(new Date("2024-06-01 19:30")),
        incoming: true
      }
    },
    {
      name: "Robert Lewandoskiiii",
      online: false,
      newestMessage: {
        type: MessageType.TEXT,
        content: "",
        sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
        incoming: false
      }
    },
    {
      name: "Pedri",
      online: true,
      newestMessage: {
        type: MessageType.TEXT,
        content: "",
        sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
        incoming: false
      }
    },
    {
      name: "Gavi",
      online: false,
      newestMessage: {
        type: MessageType.TEXT,
        content: "",
        sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
        incoming: true
      }
    },
    {
      name: "Cancelo",
      online: false,
      newestMessage: {
        type: MessageType.TEXT,
        content: "",
        sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
        incoming: false
      }
    }
  ])

  const conversations = ref<Conversation[]>([
    {
      name: "Khang",
      messages: [
        {
          type: MessageType.TEXT,
          content: "Chào ngày mới. Hôm nay là một ngày tuyệt vời. Hãy cùng chia sẻ một câu chuyện",
          sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
          incoming: false
        },
        {
          type: MessageType.TEXT,
          content: "Đây là mở đầu câu chuyện cực kì thú vị",
          sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
          incoming: true
        },
        {
          type: MessageType.TEXT,
          content: "Đây là diễn biến câu chuyện cực kì thú vị",
          sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
          incoming: true
        },
        {
          type: MessageType.TEXT,
          content: "Đây là mở đầu câu chuyện cực kì thú vị",
          sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
          incoming: false
        },
        {
          type: MessageType.TEXT,
          content:
            "If you have an existing project that uses a JavaScript package manager, you can install Vue Router from the npm registry",
          sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
          incoming: false
        },
        {
          type: MessageType.TEXT,
          content:
            "If you have an existing project that uses a JavaScript package manager, you can install Vue Router from the npm registry",
          sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
          incoming: false
        },
        {
          type: MessageType.TEXT,
          content:
            "If you have an existing project that uses a JavaScript package manager, you can install Vue Router from the npm registry",
          sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
          incoming: false
        },
        {
          type: MessageType.TEXT,
          content:
            "If you have an existing project that uses a JavaScript package manager, you can install Vue Router from the npm registry",
          sendedAt: handleSendedAt(new Date("2024-06-01 20:30")),
          incoming: false
        }
      ]
    },
    {
      name: "Minh",
      messages: []
    },
    {
      name: "Tom",
      messages: []
    },
    {
      name: "Lewandoski",
      messages: []
    },
    {
      name: "Pedri",
      messages: []
    },
    {
      name: "Gavi",
      messages: []
    },
    {
      name: "Cancelo",
      messages: []
    }
  ])

  const hasNewMessage = ref<boolean>(false)
  return { contacts, conversations, hasNewMessage }
})
