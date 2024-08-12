<script lang="ts" setup>
import { computed, ref, watchEffect } from "vue"
import Contact from "./components/contact/Contact.vue"
import Conversation from "./components/conversation/Conversation.vue"
import { useDevice } from "@/hooks/useDevice"
import { useChatStore } from "@/store/modules/chat"

const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`

const options = {
  text: "An error is about to occur...",
  background: "#F56C6C20",
  svg,
  svgViewBox: "-10, -10, 50, 50"
}

// Khởi tạo danh sách liên hệ
// const initData = async () => {
//   await useFullscreenLoading(, options)
//   console.log("ok")
// }
useChatStore().getContacts()

// Tham chiêu đến input của bộc lọc (html element)
const filterInput = ref<any>(null)

// Lưu giá trị input của bộ lọc
const search = ref<string>("")

// Kiểm tra xem thiết bị đang dùng có phải là điện thoại không
const { isMobile } = useDevice()

// Có hiển thị bộ lọc hay không
const showFilter = ref<boolean>(false)

// Hiển thị liên hệ tương ứng với liên hệ mà người dùng click vào
const handleClickContact = (email: string) => {
  if (useChatStore().contacts.get(email)?.isNewContact) {
    useChatStore().contacts.delete(email)
  }
  useChatStore().showSendNewMessage = false
  useChatStore().currentChatUser = email
  useChatStore().hasNewMessage = true

  // Cập nhập trạng thái đọc tin nhắn
  useChatStore().readMessage(email)
}

// Lọc liên hệ theo giá trị mà người dùng nhập
const handleFilter = (name: string) => {
  const reg = new RegExp(search.value)
  return reg.test(name)
}

const handleSearchUser = () => {
  useChatStore().showSendNewMessage = true
  useChatStore().currentChatUser = ""
}

// Nếu người dùng không dùng chức năng lọc nữa => xóa nội dung trong input của  bộ lọc
watchEffect(() => {
  showFilter.value || filterInput.value?.clear()
})

let contacts = computed(() => {
  return Array.from(useChatStore().contacts).reverse() || []
})
</script>
<template>
  <div class="app-container">
    <div class="contacts" v-if="1 || !isMobile || useChatStore().showContacts">
      <div class="contacts-header">
        <div v-if="!showFilter" class="contacts-header-main">
          <span class="contacts-header-main-title">Chat</span>
          <div>
            <el-tooltip content="Filter" placement="top">
              <el-icon class="contacts-header-main-icon" @click="showFilter = true"><Filter /></el-icon>
            </el-tooltip>
            <el-tooltip content="New chat" placement="top">
              <el-icon class="contacts-header-main-icon" @click="handleSearchUser">
                <EditPen />
              </el-icon>
            </el-tooltip>
          </div>
        </div>
        <el-input
          ref="filterInput"
          v-if="showFilter"
          class="contacts-header-search"
          v-model="search"
          placeholder="Search..."
        >
          <template #suffix>
            <el-tooltip content="Close filter" placement="top">
              <el-icon class="contacts-header-main-icon" @click="showFilter = false"><CloseBold /></el-icon>
            </el-tooltip>
          </template>
        </el-input>
      </div>
      <el-skeleton v-show="useChatStore().loadingData" class="list-skeleton" :count="4" animated />
      <el-scrollbar v-show="!useChatStore().loadingData" class="list">
        <template v-for="value in contacts" :key="value[0]">
          <Contact
            :email="value[1].email"
            :name="value[1].name"
            :online="value[1].online"
            :unreadMessage="value[1].unreadMessage"
            :avatar="value[1].avatar"
            v-show="handleFilter(value[1].name)"
            @click="handleClickContact(value[1].email)"
          />
        </template>
      </el-scrollbar>
    </div>
    <Conversation v-if="1 || !isMobile || !useChatStore().showContacts" class="conversation" />
  </div>
</template>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.contacts {
  width: 20%;
  display: flex;
  flex-direction: column;
  padding-right: 10px;

  &-header {
    width: 94%;
    height: 3rem;
    margin: 0 10px 10px 10px;
    border-radius: 5px;
    background-color: var(--el-bg-color-overlay);

    &-main {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0px 10px;

      &-title {
        font-size: large;
        font-weight: 700;
      }

      &-icon {
        margin-right: 10px;

        &:hover {
          cursor: pointer;
          color: var(--el-color-primary);
        }
      }
    }

    &-search {
      height: 100%;
    }
  }
}

.conversation {
  width: 80%;
}
</style>
