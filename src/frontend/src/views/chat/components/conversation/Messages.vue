<script lang="ts" setup>
import Message from "./Message.vue"
import { MessageData, useChatStore } from "@/store/modules/chat"
import TextMsg from "./message-types/TextMsg.vue"
import { computed, onMounted, ref, watchEffect } from "vue"
import TimeLine from "./message-types/TimeLine.vue"
import MediaMsg from "./message-types/MediaMsg.vue"
import FileMsg from "./message-types/FileMsg.vue"

const msgs: any = ref(null)
const messages = ref<MessageData[]>([])

// Xử lí khi người dùng cuộn xem tin nhắn
const handleScrollMessages = (distance: { scrollTop: number; scrollLeft: number }) => { }

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
  messages.value = useChatStore().conversations.get(useChatStore().currentChatUser) || []
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
    <div class="newchat" v-show="isNewChat">
      <SvgIcon class="newchat-image" name="new-chat"></SvgIcon>
      <span>Start new chat with your colleague</span>
    </div>
    <el-scrollbar ref="msgs" v-show="!isNewChat" @scroll="handleScrollMessages">
      <template v-for="(msg, index) in messages" :key="index">
        <Message :type="msg.type.toString()" :incoming="msg.incoming" :status="msg.status?.toString()"
          :last-message="index + 1 === messages.length">
          <TextMsg v-if="msg.type === 'TEXT'" :content="msg.content" :sent-at="msg.sendedAt"></TextMsg>
          <MediaMsg v-if="msg.type === 'IMAGE'" :content="msg.content" :sent-at="msg.sendedAt"></MediaMsg>
          <FileMsg v-if="msg.type === 'FILE'" :content="msg.content" :sent-at="msg.sendedAt"></FileMsg>
        </Message>
        <TimeLine v-if="msg.type === 'TIMELINE'" :content="msg.content"></TimeLine>
      </template>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.msgs-container {
  height: 100%;
  padding: 7px 24px;

  .newchat {
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
}
</style>
