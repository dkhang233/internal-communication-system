<script lang="ts" setup>
import Message from "./Message.vue"
import { useChatStore } from "@/store/modules/chat"
import TextMsg from "./message-types/TextMsg.vue"
import { ref, watchEffect } from "vue"

const msgs: any = ref(null)

watchEffect(() => {
  if (useChatStore().hasNewMessage) {
    msgs?.value?.scrollTo({ top: msgs?.value?.wrapRef?.scrollHeight, behavior: "smooth" })
    useChatStore().hasNewMessage = false
  }
})
</script>

<template>
  <el-scrollbar ref="msgs" class="msgs-container">
    <Message v-for="msg in useChatStore().conversations[0].messages">
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
