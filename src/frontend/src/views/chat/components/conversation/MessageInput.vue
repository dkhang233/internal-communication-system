<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useChatStore, handleSendedAt, MessageData } from "@/store/modules/chat"
import EmojiPicker from "vue3-emoji-picker"
import { MessageResponse, MessageType } from "@/api/chat/types/message"
import { useUserStore } from "@/store/modules/user"
import { sendMessage } from "@/websocket/chat"

const msgInput = ref(null)
const input = ref<string>("")
const showEmoji = ref<boolean>(false)

const onSelectEmoji = (emoji: any) => {
  console.log(emoji.i)
  // let sym = emoji.unified.split("-")
  // let codesArray: number[] = []
  // sym.forEach((el: string) => codesArray.push(Number("0x" + el)))
  // let e: string = String.fromCodePoint(...codesArray)
  input.value += emoji.i
}

const sendMsg = () => {
  if (input && input.value !== "") {
    let message: MessageData = {
      type: MessageType.TEXT,
      content: input.value,
      sendedAt: handleSendedAt(new Date()),
      incoming: false
    }

    let currentContact = useChatStore().contacts[useChatStore().currentChatUser]
    let msgs = useChatStore().conversations.get(currentContact.email) || []
    msgs.push(message)
    useChatStore().conversations.set(currentContact.email, msgs)
    input.value = ""
    useChatStore().hasNewMessage = true
    let messageRequest: MessageResponse = {
      sender: useUserStore().email,
      recipient: currentContact.email,
      type: message.type,
      content: message.content,
      sendedAt: new Date()
    }
    sendMessage(messageRequest)
  }
}

// onMounted(() => {
//   msgInput?.value?.input?.on("keyup", function (e: any) {
//     console.log("Press Enter")
//     if (e.key === "Enter" || e.keyCode === 13) {
//       console.log("Press Enter")
//     }
//   })
//   console.log(msgInput?.value?.input)
// })
</script>

<template>
  <div class="msg-input-container">
    <div>
      <EmojiPicker class="msg-emoji" v-if="showEmoji" :native="true" @select="onSelectEmoji" />
      <el-input ref="msgInput" class="msg-input" v-model="input" size="large" placeholder="Please Input">
        <template #suffix>
          <div class="msg-emoji-btn" @click="showEmoji = !showEmoji">
            <SvgIcon name="smile-emoji" />
          </div>
        </template>
      </el-input>
    </div>
    <div class="send-msg-btn" @click="sendMsg">
      <SvgIcon name="send"></SvgIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.msg-emoji {
  position: fixed;
  right: 10%;
  bottom: 12%;

  &-btn {
    width: 30px;
    cursor: pointer;
    &:hover {
      color: black;
    }
  }
}

.msg-input {
  &-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  margin: 0px 8px;
  width: 35rem;
  @media screen and (max-width: 665px) and (min-width: 450px) {
    width: 25rem;
  }

  @media screen and (max-width: 450px) {
    width: 17rem;
  }
}

.send-msg-btn {
  padding: 10px;
  border-radius: 5px;
  background-color: var(--el-color-primary);
}
</style>
