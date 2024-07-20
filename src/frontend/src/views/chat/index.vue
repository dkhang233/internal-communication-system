<script lang="ts" setup>
import { ref, watchEffect } from "vue"
import Contact from "./components/contact/Contact.vue"
import Conversation from "./components/conversation/Conversation.vue"
import { useDevice } from "@/hooks/useDevice"
import { useChatStore } from "@/store/modules/chat"

useChatStore().getContacts()
const search = ref<string>("")
const filterInput = ref<any>(null)
const { isMobile } = useDevice()
const showFilter = ref<boolean>(false)

// Show correspond contact when user click on contact
const handleClickContact = (key: number) => {
  useChatStore().showSendNewMessage = false
  useChatStore().currentChatUser = key - 1
  useChatStore().hasNewMessage = true
}

const handleFilterInput = (value: string) => {
  const reg = new RegExp(value)
  useChatStore().contacts.forEach((contact) => {
    if (!reg.test(contact.name)) contact.show = false
    else contact.show = true
  })
}

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
      <!-- <el-icon class="icon-wrapper"><Search /></el-icon>
        <input class="input" v-model="search" placeholder="Search..." /> -->
      <el-scrollbar class="list">
        <Contact
          v-for="index in useChatStore().contacts.length"
          :index="index"
          v-show="useChatStore().contacts[index - 1].show"
          @click="handleClickContact(index)"
        />
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
    margin: 0px 10px;
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
