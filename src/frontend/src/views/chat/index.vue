<script lang="ts" setup>
import { ref } from "vue"
import Contact from "./components/contact/Contact.vue"
import Conversation from "./components/conversation/Conversation.vue"
import { useDevice } from "@/hooks/useDevice"
import { useChatStore } from "@/store/modules/chat"
const search = ref<string>("")
const { isMobile } = useDevice()

const selectedContact = {
  name: "Lewandoski",
  online: true,
  messages: "hehe"
}
</script>
<template>
  <div class="app-container">
    <div class="contacts" v-if="!isMobile">
      <el-input class="search" v-model="search" placeholder="Search..." prefix-icon="Search" />
      <!-- <el-icon class="icon-wrapper"><Search /></el-icon>
        <input class="input" v-model="search" placeholder="Search..." /> -->
      <el-scrollbar class="list">
        <Contact
          v-for="contact in useChatStore().contacts"
          :name="contact.name"
          :online="contact.online"
          :newest-message="contact.newestMessage.content"
          :sended-at="contact.newestMessage.sendedAt"
        />
      </el-scrollbar>
    </div>
    <Conversation class="conversation" :name="selectedContact.name" :online="selectedContact.online"></Conversation>
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
