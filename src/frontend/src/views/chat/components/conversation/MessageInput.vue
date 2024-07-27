<script lang="ts" setup>
import { ref } from "vue"
import { useChatStore, handleSendedAt, MessageData } from "@/store/modules/chat"
import EmojiPicker from "vue3-emoji-picker"
import MessageStatus from "@/constants/message-status"
import MessageType from "@/constants/message-type"

const msgInput = ref(null)
const input = ref<string>("")
const showEmoji = ref<boolean>(false)

// Chèn emoji vào tin nhắn
const onSelectEmoji = (emoji: any) => {
  input.value += emoji.i
}

// Gửi tin nhắn
const sendMsg = () => {
  if (input && input.value !== "") {
    let message: MessageData = {
      type: MessageType.TEXT,
      content: input.value,
      sendedAt: handleSendedAt(new Date()),
      incoming: false,
      status: MessageStatus.SENDING
    }
    useChatStore().sendMessage(message)
    input.value = ""
  }
}

// Nếu người dùng ấn enter khi nhập tin nhắn => gửi tin nhắn
const handlePressEnter = (e: any) => {
  if (e?.keyCode === 13) {
    sendMsg()
  }
}
</script>

<template>
  <div class="msg-input-container">
    <div>
      <EmojiPicker class="msg-emoji" v-if="showEmoji" :native="true" @select="onSelectEmoji" />
      <el-input
        ref="msgInput"
        class="msg-input"
        v-model="input"
        size="large"
        placeholder="Please Input"
        @keydown="handlePressEnter"
      >
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
