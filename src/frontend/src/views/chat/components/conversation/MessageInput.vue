<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useChatStore, MessageType, handleSendedAt, MessageData } from "@/store/modules/chat"
import EmojiPicker from "vue3-emoji-picker"

const msgInput = ref(null)
const input = ref<string>("Xin chào")
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
    const message: MessageData = {
      type: MessageType.TEXT,
      content: input.value,
      sendedAt: handleSendedAt(new Date()),
      incoming: false
    }
    useChatStore().conversations.get("abc@com")?.push(message)
    input.value = ""
    setTimeout(() => (useChatStore().hasNewMessage = true), 100)
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
    width: 35px;
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
  width: 40rem;
  @media screen and (max-width: 500px) {
    width: 18rem;
  }
}

.send-msg-btn {
  padding: 10px;
  border-radius: 5px;
  background-color: var(--el-color-primary);
}
</style>
onMounted,import { log } from "console";import { on } from "events";
