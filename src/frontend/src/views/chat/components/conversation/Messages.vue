<script lang="ts" setup>
import Message from "./Message.vue"
import { MessageData, useChatStore } from "@/store/modules/chat"
import TextMsg from "./message-types/TextMsg.vue"
import { computed, onMounted, onUpdated, ref, watchEffect } from "vue"

const msgs: any = ref(null)
const messages = ref<MessageData[]>([])
watchEffect(() => {
  if (useChatStore().hasNewMessage) {
    setTimeout(() => {
      // msgs?.value?.scrollTo({ top: msgs?.value?.wrapRef?.scrollHeight, behavior: "smooth" })
      msgs.value?.setScrollTop(msgs.value.wrapRef?.scrollHeight)
      useChatStore().hasNewMessage = false
    }, 50)
  }
})

watchEffect(() => {
  messages.value =
    useChatStore().conversations.get(useChatStore().contacts[useChatStore().currentChatUser]?.email) || []
})

const isNewChat = computed(() => {
  return messages.value.length > 0 ? false : true
})

onMounted(() => {
  msgs?.value?.setScrollTop(msgs.value.wrapRef?.scrollHeight)
})
</script>

<template>
  <div class="msgs-container">
    <div class="msgs-container-newchat" v-show="isNewChat">
      <SvgIcon class="msgs-container-newchat-image" name="new-chat"></SvgIcon>
      <span>Start new chat with your colleague</span>
    </div>
    <el-scrollbar ref="msgs" class="msgs-container-messages" v-show="!isNewChat">
      <template v-for="msg in messages">
        <Message :type="msg.type" :sended-at="msg.sendedAt" :incoming="msg.incoming">
          <TextMsg :content="msg.content"></TextMsg>
        </Message>
      </template>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.msgs-container {
  height: 100%;
  padding: 7px 24px;

  &-newchat {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    padding: 20px;
    &-image {
      width: 80%;
      height: 300px;
    }
  }

  &-messages {
    display: flex;
    flex-direction: column;
  }
}
</style>
