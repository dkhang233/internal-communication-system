<script lang="ts" setup>
import { MessageType } from "@/api/chat/types/message"

interface Props {
  type: MessageType
  content: string
  sendedAt: string
  incoming: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: MessageType.TEXT,
  content: "",
  sendedAt: "00:00",
  incoming: false
})
</script>

<template>
  <div :class="incoming ? 'msg-container incoming-msg' : 'msg-container outcoming-msg'">
    <div class="msg-content">{{ content }}</div>
  </div>
</template>

<style lang="scss" scoped>
.msg-container {
  display: flex;
  flex-direction: row;
  margin: 5px;
}

.incoming-msg {
  justify-content: flex-start;
  .msg-content {
    background-color: var(--el-bg-color-page);
  }
}

.outcoming-msg {
  justify-content: flex-end;
  .msg-content {
    background-color: var(--el-color-primary);
    color: white !important;
  }
}
.msg-content {
  max-width: 25rem;
  @media screen and (max-width: 500px) {
    max-width: 15.5rem;
  }
  padding: 15px;
  border-radius: 10px;
  text-align: start;
}
</style>
