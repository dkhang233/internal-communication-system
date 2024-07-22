<script lang="ts" setup>
import { ref, watchEffect } from "vue"
import Contact from "./components/contact/Contact.vue"
import Conversation from "./components/conversation/Conversation.vue"
import { useDevice } from "@/hooks/useDevice"
import { useChatStore } from "@/store/modules/chat"
// Khởi tạo danh sách liên hệ
useChatStore().getContacts()

// Tham chiêu đến input của bộc lọc (html element)
const filterInput = ref<any>(null)

// Lưu giá trị input của bộ lọc
const search = ref<string>("")

// Kiểm tra xem thiết bị đang dùng có phải là điện thoại không
const { isMobile } = useDevice()

// Có hiển thị bộ lọc hay không
const showFilter = ref<boolean>(false)

// Hiển thị liên hệ tương ứng khi người dùng chọn trong kết quả lọc
const handleClickContact = (email: string) => {
  if (useChatStore().contacts.at(0)?.isNewContact) {
    useChatStore().contacts.shift()
  }
  useChatStore().showSendNewMessage = false
  useChatStore().currentChatUser = useChatStore().contacts.findIndex((c) => c.email === email)
  useChatStore().hasNewMessage = true
}

// Lọc liên hệ theo giá trị mà người dùng nhập
const handleFilterInput = (value: string) => {
  const reg = new RegExp(value)
  useChatStore().contacts.forEach((contact) => {
    if (!reg.test(contact.name)) contact.show = false
    else contact.show = true
  })
}

// Nếu người dùng không dùng chức năng lọc nữa => xóa nội dung trong input của  bộ lọc
watchEffect(() => {
  showFilter.value || filterInput.value?.clear()
})
</script>
<template>
  <div class="app-container">
    <div class="contacts" v-if="!isMobile">
      <div class="contacts-header">
        <div v-if="!showFilter" class="contacts-header-main">
          <span class="contacts-header-main-title">Chat</span>
          <div>
            <el-tooltip content="Filter" placement="top">
              <el-icon class="contacts-header-main-icon" @click="showFilter = true"><Filter /></el-icon>
            </el-tooltip>
            <el-tooltip content="New chat" placement="top">
              <el-icon class="contacts-header-main-icon" @click="useChatStore().showSendNewMessage = true">
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
          @input="handleFilterInput"
        >
          <template #suffix>
            <el-tooltip content="Close filter" placement="top">
              <el-icon class="contacts-header-main-icon" @click="showFilter = false"><CloseBold /></el-icon>
            </el-tooltip>
          </template>
        </el-input>
      </div>
      <el-scrollbar class="list">
        <template v-for="value in useChatStore().contacts" :key="value.email">
          <Contact
            :email="value.email"
            :name="value.name"
            :online="value.online"
            v-show="value.show"
            @click="handleClickContact(value.email)"
          />
        </template>
      </el-scrollbar>
    </div>
    <Conversation class="conversation" />
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
  width: 30%;
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
</style>
