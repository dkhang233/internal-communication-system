<script lang="ts" setup>
import Messages from "./Messages.vue"
import MessageInput from "./MessageInput.vue"
import StyledBadge from "../contact/StyledBadge.vue"
import { Contact, useChatStore } from "@/store/modules/chat"
import { computed, ref, watchEffect } from "vue"
import { UserInfo } from "@/api/login/types/login"
import { useUserStore } from "@/store/modules/user"

// Tham chiếu đến input (html element)
const searchInput = ref<any>(null)

// Tên liên hệ hiển thị lên header
const name = ref<String>("User")

// Trạng thái liên hệ hiển thị lên header
const online = ref<boolean>(false)

// Có hiện thị kết quả tìm kiếm hay không
const showSearchResult = ref<boolean>(false)

// Lưu giá trị của ô tìm kiếm liên hệ
const search = ref<string>("")
const searchResult = ref<UserInfo[]>([])

const handleSearchUser = (value: string) => {
  // Khi bắt đầu tìm kiếm người dùng => không có liên hệ (người dùng khác) đang chat với người dùng hiện tại
  useChatStore().currentChatUser = 99999

  // Tìm kiếm liên hệ (người dùng khác)
  useUserStore()
    .searchUser(value)
    .then((result) => {
      searchResult.value = result
    })
    .catch(() => (searchResult.value = []))
}

// Khi người dùng không focus vào ô tìm kiếm liên hệ (người dùng khác)  => ẩn kết quả tìm kiếm
const handleBlurSearchInput = () => {
  setTimeout(() => {
    showSearchResult.value = false
  }, 100)
}

//  Khi người dùng click vào một liên hệ (người dùng khác) ở kết quả tìm kiếm => thiết lập liên hệ đang chat là liên hệ đó
const handleClickUser = (user: UserInfo) => {
  // Kiểm tra xem liên hệ vừa chọn là liên hệ cũ hay mới
  if (useChatStore().conversations.has(user.email)) {
    // Nếu liên hệ cũ => chỉ cần hiện thị tin nhắn đã nhắn
    useChatStore().currentChatUser = useChatStore().contacts.findIndex((e) => e.email === user.email)
    useChatStore().showSendNewMessage = false
  } else {
    // Nếu liên hệ mới => đẩy thêm vào trong danh sách liên hệ
    let newContact: Contact = {
      email: user.email,
      name: user.username,
      online: user.status ? true : false,
      isNewContact: true,
      show: true
    }
    let newContacts = useChatStore().contacts
    newContacts.unshift(newContact)
    useChatStore().contacts = newContacts

    // Thiết lập người liên hệ đang chat là liên hệ mới ở trên
    useChatStore().currentChatUser = 0

    // Hiển thị giao diện nhắn tin thay vì tìm kiếm liên hệ
    useChatStore().showSendNewMessage = false
  }
}

// Cho biết có tồn tại kết quả tìm kiếm hay không
const hasResult = computed(() => {
  return searchResult.value.length > 0 ? false : true
})

// Nếu người liên hệ đang chat (currentChatUser) thay đổi => thay đổi tên liên hệ và trạng thái tương ứng trên header
watchEffect(() => {
  name.value = useChatStore().contacts[useChatStore().currentChatUser]?.name || "User"
  online.value = useChatStore().contacts[useChatStore().currentChatUser]?.online || false
})

// Khi người dùng ấn vào New chat => focus vào ô tìm kiếm liên hệ
watchEffect(() => {
  if (useChatStore().showSendNewMessage) searchInput.value?.focus()
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
          @blur="handleBlurSearchInput"
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
      <el-card v-show="showSearchResult" class="conversation-body-result">
        <el-scrollbar v-show="!hasResult" max-height="180px">
          <div class="conversation-body-result-item" v-for="i in searchResult" @click="handleClickUser(i)">
            <el-avatar
              class="avatar"
              v-if="!online"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <div>
              <div>{{ i.username }}</div>
              <div>{{ i.email }}</div>
            </div>
          </div>
        </el-scrollbar>
        <span v-show="hasResult">Can not find user</span>
      </el-card>
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
      max-height: 200px;
      z-index: 5;
      --el-card-padding: 10px;

      &-item {
        display: flex;
        margin: 0 0 15px 0;
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
