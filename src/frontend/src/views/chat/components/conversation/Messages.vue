<script lang="ts" setup>
import Message from "./Message.vue"
import { MessageData, useChatStore } from "@/store/modules/chat"
import TextMsg from "./message-types/TextMsg.vue"
import { onMounted, onUpdated, ref, watchEffect } from "vue"

const msgs: any = ref(null)
const messages = ref<MessageData[]>([])
watchEffect(() => {
  if (useChatStore().hasNewMessage) {
    setTimeout(() => {
      // msgs?.value?.scrollTo({ top: msgs?.value?.wrapRef?.scrollHeight, behavior: "smooth" })
      msgs?.value?.setScrollTop(msgs?.value?.wrapRef?.scrollHeight)
      useChatStore().hasNewMessage = false
    }, 50)
  }
})
watchEffect(() => {
  messages.value =
    useChatStore().conversations.get(useChatStore().contacts[useChatStore().currentChatUser]?.email) || []
})

onMounted(() => {
  msgs?.value?.setScrollTop(msgs?.value?.wrapRef?.scrollHeight)
})
</script>

<template>
  <el-scrollbar ref="msgs" class="msgs-container">
    <Message v-for="msg in messages">
      <TextMsg :type="msg.type" :content="msg.content" :sended-at="msg.sendedAt" :incoming="msg.incoming"></TextMsg>
    </Message>
  </el-scrollbar>
</template>

<style scoped>
.msgs-container {
  padding: 7px 24px;
  display: flex;
  flex-direction: column;
}
</style>
