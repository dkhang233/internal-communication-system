<script lang="ts" setup>
import { ref } from "vue"
import Contact from "./components/contact/Contact.vue"
import Conversation from "./components/conversation/Conversation.vue"
import { useDevice } from "@/hooks/useDevice"
import { useChatStore } from "@/store/modules/chat"
import { useUserStore } from "@/store/modules/user"

useChatStore().getContacts()
const search = ref<string>("")
const { isMobile } = useDevice()

const handleClickContact = (key: number) => {
  useChatStore().currentChatUser = key - 1
  useChatStore().hasNewMessage = true
}

console.log(useUserStore().email)
</script>
<template>
  <div class="app-container">
    <div class="contacts" v-if="!isMobile">
      <el-input class="search" v-model="search" placeholder="Search..." prefix-icon="Search" />
      <!-- <el-icon class="icon-wrapper"><Search /></el-icon>
        <input class="input" v-model="search" placeholder="Search..." /> -->
      <el-scrollbar class="list">
        <Contact v-for="index in useChatStore().contacts.length" :index="index" @click="handleClickContact(index)" />
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
}

.search {
  position: relative;
  background-color: var(--el-bg-color-overlay);
  width: 100%;
  height: 2.5rem;
  margin-bottom: 10px;
}
</style>
