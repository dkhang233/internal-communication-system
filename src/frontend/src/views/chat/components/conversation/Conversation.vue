<script lang="ts" setup>
import Messages from "./Messages.vue"
import MessageInput from "./MessageInput.vue"
import StyledBadge from "../contact/StyledBadge.vue"
import { useChatStore } from "@/store/modules/chat"
import { computed, ref, watchEffect } from "vue"
import { UserInfo } from "@/api/login/types/login"
import { useUserStore } from "@/store/modules/user"

const searchInput = ref<any>(null)
const name = ref<String>("User")
const online = ref<boolean>(false)
const showSearchResult = ref<boolean>(false)
const search = ref<string>("")
const searchResult = ref<UserInfo[]>([])

watchEffect(() => {
  name.value = useChatStore().contacts[useChatStore().currentChatUser]?.name || "User"
  online.value = useChatStore().contacts[useChatStore().currentChatUser]?.online || false
})

watchEffect(() => {
  if (useChatStore().showSendNewMessage) searchInput.value?.focus()
})
const handleSearchUser = (value: string) => {
  useUserStore()
    .searchUser(value)
    .then((result) => {
      searchResult.value = result
    })
    .catch((err) => (searchResult.value = []))
}

const hasResult = computed(() => {
  return searchResult.value.length > 0 ? false : true
})
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
      <el-card v-if="showSearchResult" class="conversation-body-result">
        <el-scrollbar v-show="!hasResult" max-height="180px">
          <el-card class="conversation-body-result-item" v-for="i in searchResult">
            <div>{{ i.username }}</div>
          </el-card>
        </el-scrollbar>
        <span v-show="hasResult">Can not find user</span>
      </el-card>
      <div class="conversation-body-newchat" v-if="useChatStore().showSendNewMessage">
        <SvgIcon class="conversation-body-newchat-image" name="new-chat"></SvgIcon>
        <span>Start new chat with your collegue</span>
      </div>
      <Messages v-if="!useChatStore().showSendNewMessage"></Messages>
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
      max-height: 200px;
      z-index: 5;
      --el-card-padding: 10px;
    }

    &-newchat {
      height: 86%;
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: center;
      &-image {
        width: 500px;
        height: 300px;
      }
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
