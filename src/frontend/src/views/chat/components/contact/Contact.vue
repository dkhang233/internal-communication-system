<script lang="ts" setup>
import { MessageData, useChatStore } from "@/store/modules/chat"
import StyledBadge from "./StyledBadge.vue"
import { computed, ref, watchEffect } from "vue"
import MessageType from "@/constants/message-type"
import dayjs, { Dayjs } from "dayjs"
import defaultAvatar from "@/assets/layouts/default-avatar-0.png?url"

interface Props {
  email: string
  name: string
  online: boolean
  unreadMessage: number
  avatar: string
}

const props = withDefaults(defineProps<Props>(), {})

const newestMessage = ref<MessageData>({
  id: -1,
  type: MessageType.TEXT,
  content: "",
  sendedAt: dayjs(),
  incoming: false,
  status: "SENDING"
})

const handleTime = (input: Dayjs) => {
  if (dayjs().isAfter(dayjs(input), "day")) return dayjs(input).format("DD/MM")
  return dayjs(input).format("HH:mm")
}

const displayContent = computed(() => {
  if (newestMessage.value.type === MessageType.IMAGE) return "[Image]"

  if (newestMessage.value.content === "") return "New chat"
  else return newestMessage.value.content
})

watchEffect(() => {
  newestMessage.value = useChatStore().conversations.get(props.email)?.at(-1) || {
    id: -1,
    type: MessageType.TEXT,
    content: "",
    sendedAt: dayjs(),
    incoming: false,
    status: "SENDING"
  }
})
</script>
<template>
  <div class="contact-container">
    <div class="box">
      <div class="body">
        <styledBadge class="avatar" v-show="online">
          <el-avatar :src="avatar || defaultAvatar"></el-avatar>
        </styledBadge>
        <el-avatar class="avatar" v-show="!online" :src="avatar || defaultAvatar"> </el-avatar>
        <div class="detail">
          <div class="name">{{ name }}</div>
          <div class="message">{{ displayContent }}</div>
        </div>
      </div>
      <div class="footer">
        <div class="time">{{ handleTime(newestMessage.sendedAt) }}</div>
        <el-badge v-if="unreadMessage" class="unread-msg" :value="unreadMessage"></el-badge>
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
  position: relative;
  height: 6rem;
  border-radius: 0.5rem;
  margin: 10px;
  background-color: var(--el-bg-color-overlay);

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  .footer {
    .unread-msg {
      position: absolute;
      top: 48px;
      right: 20px;
      margin-top: 5px;
    }

    .time {
      position: absolute;
      top: 30px;
      right: 12px;
      font-size: 13px;
    }
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
