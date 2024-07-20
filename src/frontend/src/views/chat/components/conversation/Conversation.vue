<script lang="ts" setup>
import Messages from "./Messages.vue"
import MessageInput from "./MessageInput.vue"
import StyledBadge from "../contact/StyledBadge.vue"
import { useChatStore } from "@/store/modules/chat"
import { ref, watchEffect } from "vue"

const searchInput = ref<any>(null)
const name = ref<String>("User")
const online = ref<boolean>(false)
const showSearchResult = ref<boolean>(false)
const search = ref<string>("")

watchEffect(() => {
  name.value = useChatStore().contacts[useChatStore().currentChatUser]?.name || "User"
  online.value = useChatStore().contacts[useChatStore().currentChatUser]?.online || false
})

watchEffect(() => {
  if (useChatStore().showSendNewMessage) searchInput.value?.focus()
})
const handleSearchUser = (value: string) => {}
</script>
<template>
  <div class="conversation-container">
    <div class="conversation-header">
      <div v-if="useChatStore().showSendNewMessage" class="conversation-header-search">
        <span>Đến: </span>
        <el-input
          ref="searchInput"
          class="conversation-header-search-input"
          placeholder="Input email or username"
          v-model="search"
          clearable
          @focus="showSearchResult = true"
          @blur="showSearchResult = false"
          @input="handleSearchUser"
        >
        </el-input>
      </div>
      <div v-if="!useChatStore().showSendNewMessage" class="conversation-header-info">
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
    </div>
    <div class="conversation-body">
      <el-card v-if="showSearchResult" class="conversation-body-result"></el-card>
      <Messages></Messages>
    </div>
    <MessageInput class="conversation-footer"></MessageInput>
  </div>
</template>
<style lang="scss" scoped>
.conversation {
  &-container {
    width: 100%;
    height: 100%;
    background-color: var(--el-bg-color-overlay);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
  }

  &-header {
    box-shadow: 0px 0.2px var(--el-text-color-regular);
    height: 10%;
    padding: 3px;
    align-content: center;
    &-search {
      display: flex;
      justify-content: space-around;
      padding: 5px 10px;
      &-input {
        width: 90%;
      }
    }

    &-info {
      display: flex;
      // border-bottom: 2px;
    }
  }

  &-body {
    position: relative;
    height: 80%;
    &-result {
      position: absolute;
      left: 10%;
      width: 80%;
      height: 200px;
      z-index: 5;
      background-color: aquamarine;
    }
  }

  &-footer {
    padding: 10px;
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
