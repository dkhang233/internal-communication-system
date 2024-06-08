<script lang="ts" setup>
import { ref } from "vue"
import Contact from "./components/Contact.vue"
import Message from "./components/Message.vue"
import { useDevice } from "@/hooks/useDevice"
const search = ref<string>("")
const { isMobile } = useDevice()
const contacts = [
  {
    name: "Khang",
    online: true,
    message: "Hello",
    sendedAt: "16:00"
  },
  {
    name: "Minh",
    online: true,
    message: "How are you?",
    sendedAt: "7:00"
  },
  {
    name: "Tom",
    message: "hehe",
    sendedAt: "11:10"
  }
]
</script>
<template>
  <div class="app-container">
    <div class="contacts">
      <el-input class="search" v-model="search" placeholder="Search..." prefix-icon="Search" />
      <!-- <el-icon class="icon-wrapper"><Search /></el-icon>
        <input class="input" v-model="search" placeholder="Search..." /> -->
      <el-scrollbar class="list">
        <Contact
          v-for="contact in contacts"
          :name="contact.name"
          :online="contact.online"
          :newest-message="contact.message"
          :sended-at="contact.sendedAt"
        />
      </el-scrollbar>
    </div>
    <Message class="messages" v-if="!isMobile"></Message>
  </div>
</template>
<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: row;
}

.contacts {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-right: 10px;
}

.messages {
  flex-grow: 10;
}

.search {
  position: relative;
  background-color: var(--el-bg-color-overlay);
  width: 100%;
  height: 2.5rem;
  margin-bottom: 10px;
}
</style>
