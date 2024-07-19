<script lang="ts" setup>
import Messages from "./Messages.vue"
import MessageInput from "./MessageInput.vue"
import StyledBadge from "../contact/StyledBadge.vue"
import { useChatStore } from "@/store/modules/chat"
import { ref, watchEffect } from "vue"

const name = ref<String>("User")
const online = ref<boolean>(false)

watchEffect(() => {
  name.value = useChatStore().contacts[useChatStore().currentChatUser]?.name || "User"
  online.value = useChatStore().contacts[useChatStore().currentChatUser]?.online || false
})
</script>
<template>
  <div class="conversation-container">
    <div class="conversation-header">
      <styledBadge class="avatar" v-if="online">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        </el-avatar>
      </styledBadge>
      <el-avatar
        class="avatar"
        v-if="!online"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
      <div class="info">
        <div class="name">{{ name || "User" }}</div>
        <div class="status">{{ online ? "Online" : "Offline" }}</div>
      </div>
    </div>
    <Messages class="conversation-body"></Messages>
    <MessageInput class="conversation-footer"></MessageInput>
  </div>
</template>
<style lang="scss" scoped>
.conversation {
  &-container {
    width: 100%;
    height: 100%;
    background-color: var(--el-bg-color-overlay);
  }

  &-header {
    height: 10%;
    padding: 3px;
    display: flex;
    align-items: center;
    box-shadow: 0px 0.2px var(--el-text-color-regular);
    // border-bottom: 2px;
  }

  &-body {
    height: 80%;
  }

  &-footer {
    height: 10%;
    box-shadow: 0px -0.2px var(--el-text-color-regular);
  }
}

.avatar {
  margin: 0px 15px;
}

.name {
  font-weight: 800;
  padding-bottom: 5px;
}
</style>
