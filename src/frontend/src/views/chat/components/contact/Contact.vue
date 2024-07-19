<script lang="ts" setup>
import { Contact, MessageData, useChatStore } from "@/store/modules/chat"
import StyledBadge from "./StyledBadge.vue"
import { ref, watchEffect } from "vue"
import { MessageType } from "@/api/chat/types/message"
interface Props {
  index: number
}

const props = withDefaults(defineProps<Props>(), {})
const data = useChatStore().contacts[props.index - 1]
const newestMessage = ref<MessageData>({
  type: MessageType.TEXT,
  content: "",
  sendedAt: "00:00",
  incoming: false
})

watchEffect(() => {
  let length = useChatStore().conversations.get(data.email)?.length || 0
  newestMessage.value = useChatStore()
    .conversations.get(data.email)
    ?.at(length - 1) || {
    type: MessageType.TEXT,
    content: "",
    sendedAt: "00:00",
    incoming: false
  }
})
</script>
<template>
  <div class="contact-container">
    <div class="box">
      <div class="body">
        <styledBadge class="avatar" v-if="data.online">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
          </el-avatar>
        </styledBadge>
        <el-avatar
          class="avatar"
          v-if="!data.online"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        >
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        </el-avatar>
        <div class="detail">
          <div class="name">{{ data.name }}</div>
          <div class="message">{{ newestMessage.content }}</div>
        </div>
      </div>
      <div class="footer">
        <div>{{ newestMessage.sendedAt }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
%layout-shared {
  display: flex;
  align-items: center;
}

.contact-container {
  height: 6rem;
  border-radius: 0.5rem;
  margin: 10px;
  background-color: var(--el-bg-color-overlay);

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}

.box {
  @extend %layout-shared;
  height: 100%;
  padding: 16px;
  justify-content: space-between;
}

.body {
  @extend %layout-shared;
}

.avatar {
  margin-right: 15px;
}
.detail {
  height: 100%;
}

.name {
  max-width: 6.5rem;
  font-weight: 800;
  margin-bottom: 7px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.message {
  max-width: 8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
